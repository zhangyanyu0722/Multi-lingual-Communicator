#/usr/bin/env python
#coding=utf8
import urllib.parse
import http.client
import random
import hashlib
# https://ai.youdao.com/fanyi-services.s
appKey = '*****'
secretKey = '******'
 
def youdaoTranslate(text,fromLang='en',toLang='zh-CHS'):
    httpClient = None
    salt = random.randint(1, 65536)
    sign = appKey+text+str(salt)+secretKey
    m1 = hashlib.new('md5')
    m1.update(sign.encode("utf-8"))
    sign = m1.hexdigest()
    myurl = '/api?appKey='+appKey+'&q='+ urllib.parse.quote(text)+'&from='+fromLang+'&to='+toLang+'&salt='+str(salt)+'&sign='+sign
    try:
        httpClient = http.client.HTTPConnection('openapi.youdao.com')
        httpClient.request('GET', myurl)
        response = httpClient.getresponse()
        s = eval(response.read().decode("utf-8"))['translation']
    except Exception as e:
        print(e)
    finally:
        if httpClient:
            httpClient.close()
    return s
 
if __name__ == '__main__':
    ss = youdaoTranslate('床前明月光,疑是地上霜,举头望明月,低头思故乡.',fromLang='zh-CHS',toLang='en')
    print(ss)