from faceswap import *
import os, requests, time
from flask import Flask, send_from_directory, request

app = Flask(__name__)

@app.route("/swapFaces", methods=["GET", "POST"])
def swapFaces():
	response = request.get_json(cache=False)
	gif_url = response['gif']
	img_name = response['img']
	with open('img/tmp.gif', 'wb') as f:
		f.write(requests.get(gif_url).content)
	uniqueId = str(int(time.time()))
	os.system('python processGif.py %s %s %s' %("img/tmp.gif", "img/" + img_name, uniqueId))
	return uniqueId

@app.route('/<path:path>')
def send_static(path):
    return send_from_directory("",path)

if __name__ == "__main__":
    app.run()
