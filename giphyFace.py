from faceswap import *
import os
from PIL import Image

# get face landmarks
gif = sys.argv[1]
face, landmarks2 = read_im_and_landmarks(sys.argv[2])
mask = get_face_mask(face, landmarks2)

# extract frames
currFrame = Image.open(gif)
if not os.path.exists("img"):
    os.makedirs("img")
frameNum = 0
while currFrame:
    currFrame.save("img/%s.gif" % frameNum, "GIF")
    frameNum += 1
    try:
        currFrame.seek(frameNum)
    except EOFError:
        break;

# # faceswap all frames (adapted from faceswap.py)
# swapped = []
# for frame in frames:
# 	im1, landmarks1 = read_im_and_landmarks(frame) # gif
# 	M = transformation_from_points(landmarks1[ALIGN_POINTS],
# 	                               landmarks2[ALIGN_POINTS])
# 	warped_mask = warp_im(mask, M, im1.shape)
# 	combined_mask = numpy.max([get_face_mask(im1, landmarks1), warped_mask],
# 	                          axis=0)

# 	warped_face = warp_im(face, M, im1.shape)
# 	warped_corrected_face = correct_colours(im1, warped_face, landmarks1)

# 	output_im = im1 * (1.0 - combined_mask) + warped_corrected_face * combined_mask

# 	swapped.append(output_im)

