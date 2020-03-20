import json

import requests
# http://fanyi.youdao.com/
def translate(word):
    url = 'http://fanyi.youdao.com/translate?smartresult=dict&smartresult=rule&smartresult=ugc&sessionFrom=null'
    key = {
        'type': "AUTO",
        'i': word,
        "doctype": "json",
        "version": "2.1",
        "keyfrom": "fanyi.web",
        "ue": "UTF-8",
        "action": "FY_BY_CLICKBUTTON",
        "typoResult": "true"
    }

    response = requests.post(url, data=key)

    if response.status_code == 200:
        return response.text
    else:
        print("Fail")
        return None

def get_reuslt(repsonse):
    result = json.loads(repsonse)
    print ("Input ：%s" % result['translateResult'][0][0]['src'])
    print ("Output ：%s" % result['translateResult'][0][0]['tgt'])

def main():
    word = '床前明月光，疑是地上霜.举头望明月，低头思故乡。'
    list_trans = translate(word)
    get_reuslt(list_trans)

if __name__ == '__main__':
    main()