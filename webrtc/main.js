// Generate random room name if needed
if (!location.hash) {
    location.hash = Math.floor(Math.random() * 0xFFFFFF).toString(16);
  }
  const roomHash = location.hash.substring(1);
  const drone = new ScaleDrone('hFNOafARI0AXu1Iw');
  const roomName = 'observable-' + roomHash;
  const configuration = {
    iceServers: [{
      urls: 'stun:stun.l.google.com:19302'
    }]
  };
  var mediaRecorder;
  var count = 0;
  const name = prompt("What's your name?");

  let room;
  // RTCPeerConnection
  let pc;
  // RTCDataChannel
  let dataChannel;

  var recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = true;
  recognition.interimResults = true;
  var recognizing = false;
  var final_transcript = '';

  validCheckAndOpen();

  function onError(error) {
    console.error(error);
  };

  function onSuccess(stream){
    recognition.start();
    console.log('Ready for Recognition');

    recognition.onstart = function(){
      recognizing = true;
      console.log('info_speak_now');
    }

    recognition.onend = (event) => {
      recognizing = false;
      const speechToText = event.results[0][0].transcript;
    }

    recognition.onresult = function(event) {
      var interim_transcript = '';
      if (typeof(event.results) == 'undefined') {
        recognition.onend = null;
        recognition.stop();
        console.log('upgrade');
        return;
      }
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      final_transcript = capitalize(final_transcript);
      final_transcript = linebreak(final_transcript);
      console.log(final_transcript);
      //报错有可能是因为不是usvstring
      //dataChannel.send(final_transcript);
      console.log(typeof(final_transcript));
      displaySubscipts();
      //document.getElementById("left").innerHTML = linebreak(final_transcript);
    };
    var first_char = /\S/;
    function capitalize(s) {
      return s.replace(first_char, function(m) { return m.toUpperCase(); });
    }
    var two_line = /\n\n/g;
    var one_line = /\n/g;
    function linebreak(s) {
      return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
    }
  }

  function displaySubscipts(data,isLocal){
    let container;
    if(isLocal){
      container = document.getElementById('containerleft');
    } else {
      container = document.getElementById('containerleft');
    }
    container.content.querySelector('.subscripts').innerHTML = data;
  }
  //只有当房间里有两个人的时候才运行
  function validCheckAndOpen(){
    drone.on('open', error => {
    if (error) {
      return console.error(error);
    }
    room = drone.subscribe(roomName);
    room.on('open', error => {
      if (error) {
        onError(error);
      }
    });
    // We're connected to the room and received an array of 'members'
    // connected to the room (including us). Signaling server is ready.
    room.on('members', members => {
      console.log('MEMBERS', members);
      // If we are the second user to connect to the room we will be creating the offer
      const isOfferer = members.length === 2;
      startWebRTC(isOfferer);
    });
  });
  }
  
  // Send signaling data via Scaledrone
  function sendMessage(message) {
    drone.publish({
      room: roomName,
      message
    });
  }
  //使用json来发送该信息，并表示信息不是自己发出的。
  //event handler
  function setupDataChannel() {
    checkDataChannelState();
    dataChannel.onopen = checkDataChannelState;
    dataChannel.onclose = checkDataChannelState;
    dataChannel.onmessage = event =>
      insertMessageToDOM(JSON.parse(event.data), false)
  }

  //检查datachannel是否ready
  function checkDataChannelState() {
    console.log('WebRTC channel state is:', dataChannel.readyState);
    if (dataChannel.readyState === 'open') {
      insertMessageToDOM({content: 'WebRTC data channel is now open'});
    }
  }
  
  function startWebRTC(isOfferer) {
    pc = new RTCPeerConnection(configuration);
    pc.onicecandidate = event => {
      if (event.candidate) {
        sendMessage({'candidate': event.candidate});
      }
    };
  
    // If user is offerer let the 'negotiationneeded' event create the offer
    if (isOfferer) {
      pc.onnegotiationneeded = () => {
        pc.createOffer().then(localDescCreated).catch(onError);
      }
      dataChannel = pc.createDataChannel('subscript');
      setupDataChannel();
    } else {
      // If user is not the offerer let wait for a data channel
      pc.ondatachannel = event => {
        dataChannel = event.channel;
        setupDataChannel();
      }
    }
    startMediaTransaction();
  
    // When a remote stream arrives display it in the #remoteVideo element
  }

  function startMediaTransaction(){
    //当track事件发生时调用函数，将remotevideo连接到网页上的远程视频位置进行显示
    pc.ontrack = event => {
      const stream = event.streams[0];
      if (!remoteVideo.srcObject || remoteVideo.srcObject.id !== stream.id) {
        remoteVideo.srcObject = stream;
      }
    };
    //获取本地的视频，可能会因为track导致矛盾？
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    }).then(stream => {
      localVideo.srcObject = stream;      
      onSuccess(stream);
      // Add your stream to be sent to the conneting peer
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
    }, onSuccess,onError);
  
    // Listen to signaling data from Scaledrone
    room.on('data', (message, client) => {
      // Message was sent by us
      if (client.id === drone.clientId) {
        return;
      }
  
      if (message.sdp) {
        // This is called after receiving an offer or answer from another peer
        pc.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
          // When receiving an offer lets answer it
          if (pc.remoteDescription.type === 'offer') {
            pc.createAnswer().then(localDescCreated).catch(onError);
          }
        }, onError);
      } else if (message.candidate) {
        // Add the new ICE candidate to our connections remote description
        pc.addIceCandidate(
          new RTCIceCandidate(message.candidate), onSuccess, onError
        );
      }
    });
  }
  
  function localDescCreated(desc) {
    pc.setLocalDescription(
      desc,
      () => sendMessage({'sdp': pc.localDescription}),
      onError
    );
  }