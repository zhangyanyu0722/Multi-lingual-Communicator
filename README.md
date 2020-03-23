# Live Multi-lingual Communication (Team 4)

[![Build Status](https://travis-ci.org/zhangyanyu0722/Multi-lingual-Communicator.svg?branch=master)](https://travis-ci.org/zhangyanyu0722/Multi-lingual-Communicator)
![](https://img.shields.io/badge/python-3.6%7C3.7%7C3.8-red)
![Build Status](https://img.shields.io/badge/License-MIT-green)

## Team Members
- Yanyu Zhang (U47793163) Contact : zhangya@bu.edu
- Zhou Fang (U03663101)

## Product Definition

### Project Mission
- We aim to build a [Web Real-Time Communication (WebRTC)] peer to peer application (video and audio), like simultaneous interpretation. This app can read the text of what the other person is speaking. After that, we plan to build it in differnet languages, which mean the speaker speak Chinese and the listener can receive the text in English.

For more information about WebRTC, [click here]

### User Stories
- I, the reporter, want to understand what the different languages speakers say realtime.
- I, the bussinessman, want to understand what the different languages buyers say realtime.
- I, the student, want to watch the online cources in other languages.
- I, the politician, want to comminicate with other countries's speaker.

### MVP
- Build a WEBRTC peer to peer application.
- The APP can read the text of what the other person is speaking.
- The APP can read the text of what the other person is speaking, and transfer them into other language, like English and Chinese.

Optional:
- Develop APP for five main languages in the world.
- Build a IOS/Android app and test the performance.

### How it works
<p align="middle">
  <img src= "https://github.com/zhangyanyu0722/Multi-lingual-Communicator/blob/master/images/structure.png">
</p>

- Firstly, build a WebRTC application and get the audio and video at the same time.
- Secondly, use the speech_recognition to transfer audio to text.
- Thidly, use the google API to translate text into other language.
- Finally, in this way, we can achieve different languages real time communication.

## Updates
- 3/18/2020 : Add google NLP API, google tranlate URL, Youdao translate API and Youdao translate URL methods to do the text-to-text translation
- 3/21/2020 : Add IBM Watson language translation API, add WebRTC structure.
- 3/23/2020 : Add a new method to call google URL based on curl.


[Web Real-Time Communication (WebRTC)]:https://webrtc.org/
[click here]:https://www.youtube.com/watch?v=d7NsiFXcc5A
[AIORTC]:https://github.com/aiortc/aiortc
