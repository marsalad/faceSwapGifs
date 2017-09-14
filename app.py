from flask import Flask, render_template, request
import os, json, requests, boto3

app = Flask(__name__, static_url_path='')
giphyKey = os.environ['GIPHY_API_KEY']

# load HTML
@app.route('/')
def home():
	return render_template('index.html')

# return JSON object with info from 4 GIFs
@app.route('/searchGifs', methods=['GET', 'POST'])
def searchGifs():
	response = request.get_json(cache=False)
	query = response['query']
	if query:
		requestSnippet = 'search?q=' + query + '&'
	else:
		requestSnippet = 'trending?'
	data = requests.get('https://api.giphy.com/v1/gifs/%sapi_key=%s&limit=4'
		% (requestSnippet, giphyKey)).text
	data = json.loads(data)
	htmls = []
	for i in range(4):
		htmls.append(data['data'][i]['images']['original']['url'])
	return json.dumps(htmls)

# generate and return signed request for s3 upload
@app.route('/sign_s3/')
def sign_s3():
	S3_BUCKET = os.environ.get('S3_BUCKET')

	file_name = request.args.get('file_name')
	file_type = request.args.get('file_type')

	s3 = boto3.client('s3')

	presigned_post = s3.generate_presigned_post(
		Bucket = S3_BUCKET,
		Key = file_name,
		Fields = {"acl": "public-read", "Content-Type": file_type},
		Conditions = [
			{"acl": "public-read"},
			{"Content-Type": file_type}
		],
		ExpiresIn = 3600
	)

	return json.dumps({
		'data': presigned_post,
		'url': 'https://%s.s3.amazonaws.com/%s' % (S3_BUCKET, file_name)
	})

# swap faces of user-designated GIF and image
@app.route('/swapFaces', methods=['GET', 'POST'])
def swapFaces():
	response = request.get_json(cache=False)
	gif_url = response['gif']
	img_url = response['img']
	with open('img/tmp.gif', 'wb') as f:
		f.write(requests.get(gif_url).content)
	uniqueId = str(int(time.time()))
	os.system('python processGif.py %s %s %s' 
		% ('img/tmp.gif', 'img/' + img_url, uniqueId))
	return uniqueId

# intitialize page
if __name__ == '__main__':
	port = int(os.environ.get('PORT', 5000))
	app.run(host='0.0.0.0', port=port)