from faceswap import *
import os, imageio, shutil
from PIL import Image

# get face landmarks
gif = sys.argv[1]
face, landmarks2 = read_im_and_landmarks(sys.argv[2])
mask = get_face_mask(face, landmarks2)

# extract frames
currFrame = Image.open(gif)
if not os.path.exists('swap'):
    os.makedirs('swap')
frameNum = 0
while currFrame:
    currFrame.convert('RGB').save('swap/%s.jpg' % frameNum)
    frameNum += 1
    try:
        currFrame.seek(frameNum)
    except EOFError:
        break;

# faceswap all frames (adapted from faceswap.py)
for frame in range(frameNum):
	try:
		im1, landmarks1 = read_im_and_landmarks('swap/%s.jpg' % frame)
		M = transformation_from_points(landmarks1[ALIGN_POINTS],
		                               landmarks2[ALIGN_POINTS])
		warped_mask = warp_im(mask, M, im1.shape)
		combined_mask = numpy.max([get_face_mask(im1, landmarks1), warped_mask],
		                          axis=0)

		warped_face = warp_im(face, M, im1.shape)
		warped_corrected_face = correct_colours(im1, warped_face, landmarks1)

		output_im = im1 * (1.0 - combined_mask) 
					+ warped_corrected_face * combined_mask

		cv2.imwrite('swap/%s.jpg' % frame, output_im)
	except:
		pass

frames = []
for frame in range(frameNum):
    frames.append(imageio.imread('swap/%s.jpg' % frame))
imageio.mimsave('img/' + sys.argv[3] + '.gif', frames, fps=20)
shutil.rmtree('swap')
os.remove('img/tmp.gif')
