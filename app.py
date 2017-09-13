from flask import Flask, render_template, request
import os, json, requests

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

# swap faces of user-designated GIF and image
@app.route('/swapFaces', methods=['GET', 'POST'])
def swapFaces():
	response = request.get_json(cache=False)
	gif_url = response['gif']
	img_name = response['img']
	with open('img/tmp.gif', 'wb') as f:
		f.write(requests.get(gif_url).content)
	uniqueId = str(int(time.time()))
	os.system('python processGif.py %s %s %s' 
		% ('img/tmp.gif', 'img/' + img_name, uniqueId))
	return uniqueId

# intitialize page
if __name__ == '__main__':
	port = int(os.environ.get('PORT', 5000))
	app.run(host='0.0.0.0', port=port)