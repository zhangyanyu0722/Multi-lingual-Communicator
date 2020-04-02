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

  let room;
  let pc;
  let chunks = [];
  var length = 10000;
  var int;
  const record = document.querySelector('.record');
  const stop = document.querySelector('.stop');
  const soundClips = document.querySelector('.sound-clips');

  
  function onError(error) {
    console.error(error);
  };

  

  function onSuccess(stream){
    const mediaRecorder = new MediaRecorder(stream);
    record.onclick = function() {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      console.log("recorder started");
      record.style.background = "red";

      stop.disabled = false;
      record.disabled = true;
    }

    stop.onclick = function() {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("recorder stopped");
      record.style.background = "";
      record.style.color = "";
      // mediaRecorder.requestData();

      stop.disabled = true;
      record.disabled = false;
    }
    
    mediaRecorder.onstop = function(e) {
      console.log("data available after MediaRecorder.stop() called.");

      const clipName = prompt('Enter a name for your sound clip?','My unnamed clip');

      const clipContainer = document.createElement('article');
      const clipLabel = document.createElement('p');
      const audio = document.createElement('audio');
      const deleteButton = document.createElement('button');

      clipContainer.classList.add('clip');
      audio.setAttribute('controls', '');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete';

      if(clipName === null) {
        clipLabel.textContent = 'My unnamed clip';
      } else {
        clipLabel.textContent = clipName;
      }

      clipContainer.appendChild(audio);
      clipContainer.appendChild(clipLabel);
      clipContainer.appendChild(deleteButton);
      soundClips.appendChild(clipContainer);

      console.log("creating blob");
      audio.controls = true;
      const blob = new Blob(chunks, { type: 'video/mp4; "codecs=vp9,opus"' });
      chunks = [];
      const audioURL = window.URL.createObjectURL(blob);
      //audio.src = audioURL;
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      a.href = audioURL;
      a.download = Date.now() + '.mp4';
      a.click();
      window.URL.revokeObjectURL(audioURL);
      console.log("recorder stopped");

      deleteButton.onclick = function(e) {
        let evtTgt = e.target;
        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
      }

      clipLabel.onclick = function() {
        const existingName = clipLabel.textContent;
        const newClipName = prompt('Enter a new name for your sound clip?');
        if(newClipName === null) {
          clipLabel.textContent = existingName;
        } else {
          clipLabel.textContent = newClipName;
        }
      }
    }

    mediaRecorder.ondataavailable = function(e) {
      console.log("ondataavailable exed");
      chunks.push(e.data);
    }
  }
  
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
  
  // Send signaling data via Scaledrone
  function sendMessage(message) {
    drone.publish({
      room: roomName,
      message
    });
  }
  
  function startWebRTC(isOfferer) {
    pc = new RTCPeerConnection(configuration);
  
    // 'onicecandidate' notifies us whenever an ICE agent needs to deliver a
    // message to the other peer through the signaling server
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
    }
  
    // When a remote stream arrives display it in the #remoteVideo element
    pc.ontrack = event => {
      const stream = event.streams[0];
      if (!remoteVideo.srcObject || remoteVideo.srcObject.id !== stream.id) {
        remoteVideo.srcObject = stream;
      }
    };
  
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    }).then(stream => {
      // Display your local video in #localVideo element
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