import os, sys, json
from PIL import Image

bg_size = 600,600
tn_size = 296, 296

try:
    arr_pw = processImages('pw_heatmaps')
    arr_core = processImages('core_heatmaps')

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
    print "done....<Press enter key to exit>"
    raw_input()


def processImages(dirName):
    try:
        print("In process images")

        filesList = list()
        imageDir = os.listdir("images/" + dirName + "/" )

        if not os.path.exists('images/' + dirName + '/big/'):
            os.makedirs('images/' + dirName + '/big/')

        if not os.path.exists('images/' + dirName + '/thumbs/'):
            os.makedirs('images/' + dirName + '/thumbs/')

        for file in imageDir:
            if file.endswith(".png") is False:
                continue

            print("working on file '" + file + "'")
            img_tn = Image.open('images/' + dirName + '/' + file)
            img_tn.thumbnail(tn_size)
            img_tn.save('images/' + dirName + '/thumbs/' + file, quality=70)

            img_big = Image.open('images/' + dirName + '/' + file)
            img_big.thumbnail(bg_size)
            img_big.save('images/' + dirName + '/big/' + file, quality=70)

            filesList.append([
                    'images/' + dirName + '/thumbs/' + file,
                    'images/' + dirName + '/' + file,
                    'images/' + dirName + '/big/' + file ])

            filesList.sort()

    except Exception as e:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        print("EXCEPTION------------------------------", exc_type, fname, exc_tb.tb_lineno)
    finally:
        return filesList
