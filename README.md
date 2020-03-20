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

### User Stories
- I, the reporter, want to understand what the different languages speakers say realtime.
- I, the bussinessman, want to understand what the different languages buyers say realtime.

### MVP
- Build a WEBRTC peer to peer application.
- The APP can read the text of what the other person is speaking.
- The APP can read the text of what the other person is speaking, and transfer them into other language, like English and Chinese.

### How it works
- Firstly, build a WebRTC application and get the audio and video at the same time.
- Secondly, use the speech_recognition to transfer audio to text.
- Thidly, use the google API to translate text into other language.



[Web Real-Time Communication (WebRTC)]:https://webrtc.org/
[Tim Panton]:https://www.youtube.com/watch?v=d7NsiFXcc5A
[AIORTC]:https://github.com/aiortc/aiortc
