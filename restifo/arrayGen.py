import os, sys, json
from PIL import Image

dirs_pw = os.listdir( "images/pw_heatmaps/" )
dirs_core = os.listdir("images/core_heatmaps/")

arr_pw = list()
arr_core = list()

tn_size = 591, 591

try:
    if not os.path.exists('images/core_heatmaps/thumbs/'):
        os.makedirs('images/core_heatmaps/thumbs/')
    elif not os.path.exists('images/pw_heatmaps/thumbs/'):
        os.makedirs('images/pw_heatmaps/thumbs/')

    for file in dirs_pw:
        if file.endswith(".png") is False:
            continue

        print("working on file '" + file + "'")
        img = Image.open("images/pw_heatmaps/" + file)
        img.thumbnail(tn_size)
        img.save("images/pw_heatmaps/thumbs/" + file)

        arr_pw.append(["images/pw_heatmaps/thumbs/" + file, "images/pw_heatmaps/" + file])

    for file in dirs_core:
        if file.endswith(".png") is False:
            continue

        print("working on file '" + file + "'")
        img = Image.open("images/core_heatmaps/" + file)
        img.thumbnail(tn_size)
        img.save("images/core_heatmaps/thumbs/" + file)

        arr_core.append([ "images/core_heatmaps/thumbs/" + file, "images/core_heatmaps/" + file ])

    arr_pw.sort()
    arr_core.sort()

    with open("images.json", 'wb') as outfile:
        data = {}
        data['core'] = arr_core
        data['pw'] = arr_pw
        json.dump(data, outfile)

except Exception as e:
    exc_type, exc_obj, exc_tb = sys.exc_info()
    fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
    print("EXCEPTION------------------------------", exc_type, fname, exc_tb.tb_lineno)
finally:
    print "done...."
    raw_input()
