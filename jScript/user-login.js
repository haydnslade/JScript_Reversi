/*
 * DEPRECATED
 */

/*
 *
 */
function loginToServer() {
    var server = 'http://universe.tc.uvu.edu/cs2550/assignments/PasswordCheck/check.php';
    var usrName = document.getElementById("usrName").value;
    var usrPass = document.getElementById("usrPass").value;
    var data = "userName=" + usrName + "&password=" + usrPass;
    var loginReq = new XMLHttpRequest();
    loginReq.open("POST", server);
    loginReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    loginReq.onreadystatechange = function() {
      if (loginReq.readyState == 4 && loginReq.status == 200) {
        var servRespn = JSON.parse(loginReq.responseText);
        
        if (servRespn.result == 'valid') {
          loginSuccess(servRespn);
        }
        else {
          loginFailed(servRespn.result);
        }
      }
      else {
        loginFailed(loginReq.responseText);
      }
    };
    loginReq.send(data);
}

/*
 *
 */
function loginSuccess(loginStatus) {
    window.location.href = 'othello-game.html';
    localStorage["cs2550timestamp"] = loginStatus.userName + ' ' + loginStatus.timestamp;
}

/*
 *
 */
function loginFailed(loginStatus) {
  var errorSpan = document.getElementById("loginErr");
  var loginHelp = document.getElementById("loginHelp");
  var gameLink = document.getElementById("gameLink");
  errorSpan.innerHTML = "<b>Invalid Login - Message from Server: </b>" + loginStatus;
  loginHelp.innerHTML = "<a href=\"http://universe.tc.uvu.edu/cs2550/assignments/PasswordCheck/list.php\" target=\"_blank\">A list of valid usernames and passwords can be found here.</a>";
  // Setting game link to visible so the game can be accessed without logging in
  gameLink.style.visibility = "visible";
}

/*
 *
 */
function initPage() {
    var loginBtn = document.getElementById("validateLogin");
    addHandler(loginBtn, 'click', loginToServer);
}

/* 
 * addHandler()
 * Adds the specified function from the obj on the specific event type
 * Inverse of removeHandler()
 */
function addHandler(obj, type, fn) {
    'use strict';
    if (obj && obj.addEventListener) {
        obj.addEventListener(type, fn, false);
    } else if (obj && obj.attachEvent) {
        obj.attachEvent('on' + type, fn);
    }
}

window.onload = initPage;