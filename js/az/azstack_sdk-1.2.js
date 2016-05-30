function HashMap() {
    var e = [];
    return e.size = function () {
        return this.length
    }, e.isEmpty = function () {
        return 0 === this.length
    }, e.containsKey = function (e) {
        e += "";
        for (var s = 0; s < this.length; s++)if (this[s].key === e)return s;
        return -1
    }, e.get = function (e) {
        e += "";
        var s = this.containsKey(e);
        return s > -1 ? this[s].value : void 0
    }, e.put = function (e, s) {
        return e += "", -1 !== this.containsKey(e) ? this.get(e) : void this.push({key: e, value: s})
    }, e.allKeys = function () {
        for (var e = [], s = 0; s < this.length; s++)e.push(this[s].key);
        return e
    }, e.allIntKeys = function () {
        for (var e = [], s = 0; s < this.length; s++)e.push(parseInt(this[s].key));
        return e
    }, e.remove = function (e) {
        e += "";
        var s = this.containsKey(e);
        s > -1 && this.splice(s, 1)
    }, e
}
var SERVICE_TYPE_DEFAULT = 0, SERVICE_TYPE_PING = 1, SERVICE_TYPE_LOGIN = 2, SERVICE_TYPE_LOGOUT = 3, SERVICE_TYPE_MESSAGE = 4, SERVICE_TYPE_HAVE_MESSAGE = 5, SERVICE_TYPE_MAKE_CONFERENCE = 6, SERVICE_TYPE_MESSAGE_CONFERENCE = 7, SERVICE_TYPE_HAVE_MESSAGE_CONFERENCE = 8, SERVICE_TYPE_FRIEND_LIST = 13, SERVICE_TYPE_FRIEND_LIST_DONE = 37, SERVICE_TYPE_USER_INFO = 24, SERVICE_GET_SERVER_ADDR = 29, SERVICE_TYPE_MAKE_CHAT_GROUP = 42, SERVICE_TYPE_LEAVE_CHAT_GROUP = 43, SERVICE_TYPE_INVITE_CHAT_GROUP = 44, SERVICE_TYPE_MESSAGE_CHAT_GROUP = 45, SERVICE_TYPE_MESSAGE2 = 72, SERVICE_TYPE_HAVE_MESSAGE2 = 73, SERVICE_TYPE_MESSAGE_CHAT_GROUP_REPORT = 74, SERVICE_TYPE_MESSAGE_STICKER = 104, SERVICE_TYPE_APPLICATION_CHANGE_STATE = 105, SERVICE_TYPE_MESSAGE_FILE_URL = 121, SERVICE_TYPE_CHAT_TYPING = 142, SERVICE_TYPE_MAKE_CHAT_GROUP_NOTIFICATION = 143, SERVICE_TYPE_INVITE_CHAT_GROUP_NOTIFICATION = 144, SERVICE_TYPE_LEAVE_CHAT_GROUP_NOTIFICATION = 145, SERVICE_TYPE_HAVE_MESSAGE_CHAT_GROUP = 146, SERVICE_TYPE__LIST_CHAT_GROUP = 147, SERVICE_TYPE_CHAT_GROUP_INFO = 148, SERVICE_TYPE_CHAT_GROUP_TYPING = 149, SERVICE_TYPE_CHAT_GROUP_RENAME = 150, SERVICE_TYPE_CHAT_GROUP_CANCEL_MESSAGE = 151, SERVICE_TYPE_CHAT_GROUP_RENAME_NOTIFICATION = 152, SERVICE_TYPE_MSG_SEEN = 153, SERVICE_TYPE_CHAT_GROUP_NOTIFICATION_SETTINGS = 158, SERVICE_TYPE_CHAT_GROUP_CHANGE_ADMIN = 159, SERVICE_TYPE_AUTHENTICATION = 162, SERVICE_TYPE_LIST_USERINFO_BY_USERID = 164, SERVICE_TYPE_LIST_USERINFO_BY_USERNAME = 165, SERVICE_TYPE_MESSAGE_REPORT2 = 167, SERVICE_TYPE_DELETE_MESSAGE = 168, SERVICE_TYPE_LIST_MODIFIED_MESSAGES = 169, SERVICE_TYPE_LIST_MODIFIED_CONVERSATIONS = 170, SERVICE_TYPE_LIST_DELETE_CONVERSATION = 171, SERVICE_TYPE_DELIVERED_MESSAGES = 172, SERVICE_TYPE_LIST_UNREAD_MESSAGES = 173, SERVICE_TYPE_MESSAGE_FROM_ME = 174, SERVICE_TYPE_MESSAGE_FROM_ME_JSON = 175, SERVICE_TYPE_MESSAGE_GROUP_FROM_ME = 176, SERVICE_TYPE_SEEN_MESSAGES = 178, SERVICE_TYPE_AUTHENTICATION_2_STEP = 179, SERVICE_TYPE_LIST_CHAT_GROUPS_INFO = 182, SERVICE_TYPE_LIST_MODIFIED_FILES = 191, azstack = {
    packet_queue: new HashMap,
    send_packet_queue: new HashMap,
    users: new HashMap,
    azStackUsers: new HashMap,
    masterSocket: null,
    slaveSocket: null,
    groups: new HashMap,
    getListUserInfoByUserIdRequestId: 1e3,
    waitingPacketByListUserId: new HashMap,
    callbacks: new HashMap,
    appId: null,
    publicKey: null,
    azStackUserId: null,
    userCredentials: null,
    fullname: null,
    slaveServerIp: null,
    slaveServerPort: 0,
    logLevel: "ERROR",
    callbackGetUserInfoId: 0,
    chatProxyServer: "http://az2.azstack.com:9088"
};
azstack.log = function (e, s) {
    var t = 2;
    "ERROR" == e ? t = 3 : "INFO" == e ? t = 2 : "DEBUG" == e && (t = 1);
    var a = 2;
    "ERROR" == this.logLevel ? a = 3 : "INFO" == this.logLevel ? a = 2 : "DEBUG" == this.logLevel && (a = 1), t >= a && (null != s && "object" == typeof s || Array.isArray(s) ? console.log(e + ": " + JSON.stringify(s)) : console.log(e + ": " + s))
}, azstack.addCallback = function (e, s) {
    this.callbacks.put(e, s)
}, azstack.callCallback = function (e) {
    var s = this.callbacks.get(e);
    if (s) {
        var t = new Array;
        for (i in arguments)0 != i && (t[t.length] = arguments[i]);
        s.apply(this, t)
    }
}, azstack.sendPacketMaster = function (e, s) {
    var t = {service: e, body: JSON.stringify(s)};
    this.masterSocket.emit("WebPacket", t)
}, azstack.sendPacket = function (e, s) {
    var t = {service: e, body: JSON.stringify(s)};
    this.slaveSocket.emit("WebPacket", t)
}, azstack.connect = function (e, s, t, a, r) {
    this.masterSocket = io.connect(this.chatProxyServer, {
        resource: "A/socket.io",
        "force new connection": !0
    }), this.masterSocket.on("connect", function () {
        azstack.log("DEBUG", "Client has connected to the MasterServer!"), azstack.sendPacketMaster(SERVICE_GET_SERVER_ADDR, {azStackUserId: t})
    }), this.masterSocket.on("WebPacket", function (e) {
        var s;
        s = e.body.length > 0 ? JSON.parse(e.body) : {}, azstack.packetReceived(e.service, s)
    }), this.masterSocket.on("disconnect", function () {
        azstack.log("DEBUG", "The client has disconnected with MasterServer!")
    }), this.appId = e, this.publicKey = s, this.azStackUserId = t, this.userCredentials = a, this.fullname = r
}, azstack.packetReceived = function (e, s) {
    e == SERVICE_GET_SERVER_ADDR ? this.get_server_addr_processor(e, s) : e == SERVICE_TYPE_AUTHENTICATION ? this.authentication_processor(e, s) : e == SERVICE_TYPE_PING ? this.ping_processor(e, s) : e == SERVICE_TYPE_HAVE_MESSAGE2 ? this.have_message_processor(e, s) : e == SERVICE_TYPE_CHAT_TYPING ? this.chat_typing_processor(e, s) : e == SERVICE_TYPE_CHAT_GROUP_TYPING ? this.chat_group_typing_processor(e, s) : e == SERVICE_TYPE_USER_INFO ? this.user_info_processor(e, s) : e == SERVICE_TYPE_LIST_USERINFO_BY_USERNAME ? this.user_info_by_username_processor(e, s) : e == SERVICE_TYPE_LIST_USERINFO_BY_USERID ? this.getListUserInfoByListUserIDsProcessor(e, s) : e == SERVICE_TYPE_MESSAGE_FILE_URL ? this.have_message_file_url_processor(e, s) : e == SERVICE_TYPE_LIST_MODIFIED_CONVERSATIONS ? this.get_list_modified_conversations_processor(e, s) : e == SERVICE_TYPE_LIST_MODIFIED_MESSAGES ? this.get_list_modified_messages_processor(e, s) : e == SERVICE_TYPE_LIST_UNREAD_MESSAGES ? this.get_list_unread_messages_processor(e, s) : e == SERVICE_TYPE_MESSAGE2 ? this.messageProcessor(e, s) : e == SERVICE_TYPE_MESSAGE_REPORT2 ? this.messageReportProcessor(e, s) : e == SERVICE_TYPE_DELIVERED_MESSAGES ? this.deliveredMessagesProcessor(e, s) : e == SERVICE_TYPE_LIST_CHAT_GROUPS_INFO ? this.getListGroupInfoProcessor(e, s) : e == SERVICE_TYPE_MESSAGE_CHAT_GROUP ? this.messageGroupProcessor(e, s) : e == SERVICE_TYPE_MESSAGE_CHAT_GROUP_REPORT ? this.messageReportGroupProcessor(e, s) : e == SERVICE_TYPE_HAVE_MESSAGE_CHAT_GROUP ? this.haveMessageGroupProcessor(e, s) : e == SERVICE_TYPE_MESSAGE_FROM_ME ? this.haveMsgFromMeProcessor(e, s) : e == SERVICE_TYPE_MESSAGE_FROM_ME_JSON ? this.haveMsgFromMeProcessor(e, s) : e == SERVICE_TYPE_MESSAGE_GROUP_FROM_ME ? this.haveMsgGroupFromMeProcessor(e, s) : e == SERVICE_TYPE_MAKE_CHAT_GROUP ? this.makeGroupProcessor(e, s) : e == SERVICE_TYPE_INVITE_CHAT_GROUP ? this.inviteToGroupProcessor(e, s) : e == SERVICE_TYPE_LEAVE_CHAT_GROUP ? this.leaveGroupProcessor(e, s) : e == SERVICE_TYPE_CHAT_GROUP_RENAME ? this.renameGroupProcessor(e, s) : e == SERVICE_TYPE_APPLICATION_CHANGE_STATE ? this.applicationChangeStateProcessor(e, s) : e == SERVICE_TYPE_MAKE_CHAT_GROUP_NOTIFICATION ? this.makeGroupNotificationProcessor(e, s) : e == SERVICE_TYPE_INVITE_CHAT_GROUP_NOTIFICATION ? this.inviteToGroupNotificationProcessor(e, s) : e == SERVICE_TYPE_LEAVE_CHAT_GROUP_NOTIFICATION ? this.leaveGroupNotificationProcessor(e, s) : e == SERVICE_TYPE_CHAT_GROUP_RENAME_NOTIFICATION ? this.renameGroupNotificationProcessor(e, s) : e == SERVICE_TYPE_CHAT_GROUP_INFO ? this.getGroupInfoProcessor(e, s) : e == SERVICE_TYPE_LIST_DELETE_CONVERSATION ? this.deleteConversationProcessor(e, s) : e == SERVICE_TYPE_MSG_SEEN ? this.seenMessageProcessor(e, s) : e == SERVICE_TYPE_SEEN_MESSAGES ? this.seenMessageProcessor(e, s) : e == SERVICE_TYPE_DELETE_MESSAGE ? this.deleteMessageProcessor(e, s) : e == SERVICE_TYPE__LIST_CHAT_GROUP ? this.listChatGroupProcessor(e, s) : e == SERVICE_TYPE_CHAT_GROUP_CHANGE_ADMIN ? this.chatGroupChangeAdminProcessor(e, s) : e == SERVICE_TYPE_LIST_MODIFIED_FILES ? this.chatListFilesProcessor(e, s) : e == SERVICE_TYPE_MESSAGE_STICKER ? this.haveMessageStickerProcessor(e, s) : (azstack.log("DEBUG", "unknow packet"), azstack.log("DEBUG", "service: " + e), azstack.log("DEBUG", s))
}, azstack.azSendMessageReport = function (e, s) {
    var t = {to: e, msgId: s};
    this.sendPacket(SERVICE_TYPE_MESSAGE_REPORT2, t)
}, azstack.azSendMessageGroupReport = function (e, s, t) {
    var a = {group: e, msgId: s, msgSender: t};
    this.sendPacket(SERVICE_TYPE_MESSAGE_CHAT_GROUP_REPORT, a)
}, azstack.cacheUserInfo = function (e) {
    var s = {
        userId: e.userId,
        azStackUserID: e.username,
        lastVisitDate: e.lastVisitDate,
        status: e.status,
        fullname: e.fullname
    };
    this.users.put(e.userId, s), this.azStackUsers.put(e.username, s)
}, azstack.getUserInfoAndRequestToServer = function (e, s, t) {
    var a = this.users.get(e);
    if (!a) {
        var r = this.packet_queue.get(e);
        return r || (r = [], this.packet_queue.put(e, r), this.sendPacket(SERVICE_TYPE_USER_INFO, {userId: e})), void r.push(t)
    }
    return a
}, azstack.getUserInfoAndRequestToServerWithCallBack = function (e, s, t) {
    var a = this.users.get(e);
    if (this.callbackGetUserInfoId++, this.addCallback("get_user_server_" + this.callbackGetUserInfoId, s), !a) {
        var r = this.packet_queue.get(e);
        return r || (r = [], this.packet_queue.put(e, r), this.sendPacket(SERVICE_TYPE_USER_INFO, {
            userId: e,
            purpose: this.callbackGetUserInfoId
        })), void r.push(t)
    }
    return this.callCallback("get_user_server_" + this.callbackGetUserInfoId, [a]), a
}, azstack.getUserInfoByUsernameAndRequestToServerWithCallBack = function (e, s, t) {
    var a = this.azStackUsers.get(e);
    if (this.callbackGetUserInfoId++, this.addCallback("get_user_server_" + this.callbackGetUserInfoId, s), !a) {
        azstack.log("DEBUG", "Gửi yêu cầu get user_info lên server để lấy thông tin azStackUserID=" + e);
        var r = this.send_packet_queue.get(e);
        return r || (r = [], this.send_packet_queue.put(e, r), this.sendPacket(SERVICE_TYPE_LIST_USERINFO_BY_USERNAME, {
            usernameList: [e],
            purpose: this.callbackGetUserInfoId
        })), void r.push(t)
    }
    return this.callCallback("get_user_server_" + this.callbackGetUserInfoId, [a]), a
}, azstack.getUserInfoByUsernameAndRequestToServer = function (e, s) {
    var t = this.azStackUsers.get(e);
    if (!t) {
        azstack.log("DEBUG", "Gửi yêu cầu get user_info lên server để lấy thông tin azStackUserID=" + e);
        var a = this.send_packet_queue.get(e);
        return a || (a = [], this.send_packet_queue.put(e, a), this.sendPacket(SERVICE_TYPE_LIST_USERINFO_BY_USERNAME, {usernameList: [e]})), void a.push(s)
    }
    return t
}, azstack.azSendMessage = function (e, s, t) {
    var a = {msg: e, to: 0, msgId: t}, r = {
        service: SERVICE_TYPE_MESSAGE2,
        body: a
    }, o = this.getUserInfoByUsernameAndRequestToServer(s, r);
    o && (a.to = o.userId, this.sendPacket(SERVICE_TYPE_MESSAGE2, a))
}, azstack.azSendMessageFileUrl = function (e, s, t, a, r, o, i, n) {
    var c = {
        duration: 0,
        to: 0,
        id: r,
        fileLength: o,
        fileName: s,
        type: t,
        url: e,
        width: i,
        height: n
    }, E = {service: SERVICE_TYPE_MESSAGE_FILE_URL, body: c}, _ = this.getUserInfoByUsernameAndRequestToServer(a, E);
    _ && (c.to = _.userId, this.sendPacket(SERVICE_TYPE_MESSAGE_FILE_URL, c))
}, azstack.azSendMessageGroup = function (e, s, t) {
    var a = {msg: e, group: s, msgId: t};
    this.sendPacket(SERVICE_TYPE_MESSAGE_CHAT_GROUP, a)
}, azstack.azSendMessageSticker = function (e, s, t, a, r, o, i) {
    var n = {
        imgName: s,
        catId: t,
        topText: "",
        bottomText: "",
        middleText: "",
        id: a,
        to: 0,
        url: r,
        width: o,
        height: i
    }, c = {service: SERVICE_TYPE_MESSAGE_STICKER, body: n}, E = this.getUserInfoByUsernameAndRequestToServer(e, c);
    E && (n.to = E.userId, this.sendPacket(SERVICE_TYPE_MESSAGE_STICKER, n))
}, azstack.azSendMessageStickerGroup = function (e, s, t, a, r, o, i) {
    var n = {type: 3, msgId: a, group: e, catId: t, url: r, imgName: s, width: o, height: i};
    this.sendPacket(SERVICE_TYPE_MESSAGE_CHAT_GROUP, n)
}, azstack.azSendMessageFileUrlGroup = function (e, s, t, a, r, o, i, n) {
    var c = {fileLength: o, fileName: r, group: e, msgId: s, url: t, type: a, width: i, height: n};
    this.sendPacket(SERVICE_TYPE_MESSAGE_CHAT_GROUP, c)
}, azstack.azGetListModifiedConversations = function (e) {
    var s = {lastUpdate: e};
    this.sendPacket(SERVICE_TYPE_LIST_MODIFIED_CONVERSATIONS, s)
}, azstack.azGetListModifiedMessages = function (e, s, t) {
    var a = {lastUpdate: e, type: s, chatId: t};
    this.sendPacket(SERVICE_TYPE_LIST_MODIFIED_MESSAGES, a)
}, azstack.azGetListUnreadMessages = function (e, s) {
    var t = {type: e, chatId: s};
    this.sendPacket(SERVICE_TYPE_LIST_UNREAD_MESSAGES, t)
}, azstack.azSendTyping = function (e, s) {
    if (1 == e) {
        var t = {to: s};
        this.sendPacket(SERVICE_TYPE_CHAT_TYPING, t)
    } else if (2 == e) {
        var t = {group: s};
        this.sendPacket(SERVICE_TYPE_CHAT_GROUP_TYPING, t)
    }
}, azstack.requestUserInfoForPacket = function (e, s, t) {
    this.getListUserInfoByUserIdRequestId++, this.waitingPacketByListUserId.put(this.getListUserInfoByUserIdRequestId, {
        service: s,
        body: t
    }), this.sendPacket(SERVICE_TYPE_LIST_USERINFO_BY_USERID, {
        userIdList: e.allIntKeys(),
        purpose: this.getListUserInfoByUserIdRequestId
    })
}, azstack.requestGroupInfoForPacket = function (e, s, t) {
    this.getListUserInfoByUserIdRequestId++, this.waitingPacketByListUserId.put(this.getListUserInfoByUserIdRequestId, {
        service: s,
        body: t
    }), this.sendPacket(SERVICE_TYPE_LIST_CHAT_GROUPS_INFO, {
        list: e.allIntKeys(),
        purpose: this.getListUserInfoByUserIdRequestId
    })
}, azstack.azMakeGroup = function (e, s, t, a) {
    var r = {members: e, name: s, msgId: t};
    this.sendPacket(SERVICE_TYPE_MAKE_CHAT_GROUP, r), this.addCallback("makeGroup_" + t, a)
}, azstack.azInviteToGroup = function (e, s, t, a) {
    var r = {members: e, group: s, msgId: t};
    this.sendPacket(SERVICE_TYPE_INVITE_CHAT_GROUP, r), this.addCallback("inviteToGroup_" + t, a)
}, azstack.azLeaveGroup = function (e, s, t, a) {
    var r = {leaveUser: e, group: s, msgId: t};
    this.sendPacket(SERVICE_TYPE_LEAVE_CHAT_GROUP, r), this.addCallback("leaveGroup_" + t, a)
}, azstack.azRenameGroup = function (e, s, t, a) {
    var r = {name: e, group: s, msgId: t};
    this.sendPacket(SERVICE_TYPE_CHAT_GROUP_RENAME, r), this.addCallback("renameGroup_" + t, a)
}, azstack.azGetGroupInfo = function (e, s) {
    var t = {group: e};
    this.sendPacket(SERVICE_TYPE_CHAT_GROUP_INFO, t), this.addCallback("getGroupInfo_" + e, s)
}, azstack.azDeleteConversation = function (e, s, t, a) {
    var r = {chatId: e, type: s, lastTimeCreated: t};
    this.sendPacket(SERVICE_TYPE_LIST_DELETE_CONVERSATION, r), this.addCallback("deleteConversation_" + e + "_" + s + "_" + t, a)
}, azstack.azSeenMessage = function (e, s, t, a) {
    var r = {msgId: e, senderId: s, type: t, chatId: a};
    this.sendPacket(SERVICE_TYPE_MSG_SEEN, r)
}, azstack.azSeenMessages = function (e, s, t, a) {
    var r = {chatId: e, type: s, lastMsgCreated: t, list: a};
    this.sendPacket(SERVICE_TYPE_SEEN_MESSAGES, r)
}, azstack.disconnect = function () {
    this.appId = null, this.publicKey = null, this.azStackUserId = null, this.userCredentials = null, this.fullname = null, this.masterSocket.disconnect(), this.slaveSocket.disconnect(), this.packet_queue = new HashMap, this.send_packet_queue = new HashMap, this.users = new HashMap, this.azStackUsers = new HashMap, this.masterSocket = null, this.slaveSocket = null, this.groups = new HashMap, this.waitingPacketByListUserId = new HashMap, this.callbacks = new HashMap, this.slaveServerIp = null, this.slaveServerPort = 0
}, azstack.azDeleteMessage = function (e, s, t, a, r) {
    var o = {msgId: e, senderId: s, chatId: t, type: a};
    this.sendPacket(SERVICE_TYPE_DELETE_MESSAGE, o), this.addCallback("deleteMessage_" + s + "_" + e, r)
}, azstack.azListChatGroup = function () {
    var e = {};
    this.sendPacket(SERVICE_TYPE__LIST_CHAT_GROUP, e)
}, azstack.azChatGroupChangeAdmin = function (e, s, t) {
    var a = {group: e, newAdmin: s, msgId: t};
    this.sendPacket(SERVICE_TYPE_CHAT_GROUP_CHANGE_ADMIN, a)
}, azstack.azListFiles = function (e) {
    var s = {lastUpdate: e};
    this.sendPacket(SERVICE_TYPE_LIST_MODIFIED_FILES, s)
}, azstack.azApplicationChangeState = function (e) {
    var s = {state: e};
    this.sendPacket(SERVICE_TYPE_APPLICATION_CHANGE_STATE, s)
}, azstack.ping_processor = function (e, s) {
    this.sendPacket(SERVICE_TYPE_PING, {})
}, azstack.get_server_addr_processor = function (e, s) {
    azstack.log("DEBUG", "get_server_addr_processor"), azstack.log("DEBUG", s), this.slaveServerIp = s.ip, this.slaveServerPort = s.port, azstack.log("DEBUG", "this.slaveServerIp: " + this.slaveServerIp), azstack.log("DEBUG", "this.slaveServerPort: " + this.slaveServerPort), this.masterSocket.disconnect(), this.slaveSocket = io.connect(this.chatProxyServer, {
        resource: "B/socket.io",
        "force new connection": !0
    }), this.slaveSocket.io.reconnection(!1), this.slaveSocket.on("connect", function () {
        azstack.log("INFO", "Client has connected to the SlaveServer!"), azstack.internalAuthentication()
    }), this.slaveSocket.on("WebPacket", function (e) {
        var s;
        s = e.body.length > 0 ? JSON.parse(e.body) : {}, azstack.packetReceived(e.service, s)
    }), this.slaveSocket.on("disconnect", function () {
        azstack.log("INFO", "The client has disconnected with SlaveServer!"), azstack.appId && azstack.publicKey && azstack.azStackUserId && setTimeout(function () {
            azstack.connect(azstack.appId, azstack.publicKey, azstack.azStackUserId, azstack.userCredentials, azstack.fullname)
        }, 500)
    })
}, azstack.internalAuthentication = function () {
    var e = {azStackUserId: this.azStackUserId, userCredentials: this.userCredentials}, s = new JSEncrypt;
    s.setPublicKey(this.publicKey);
    var t = s.encrypt(JSON.stringify(e));
    if (!t)return void console.log("Could not encrypt authenStringPlaintext, please check your public key");
    azstack.log("DEBUG", "send authen packet to SlaveServer");
    var a = {
        slaveIp: this.slaveServerIp,
        slavePort: this.slaveServerPort,
        token: t,
        fullname: this.fullname,
        appId: this.appId,
        platform: 3,
        sdkVersion: "2.1.1",
        screenSize: window.screen.width + "x" + window.screen.height
    };
    this.sendPacket(SERVICE_TYPE_AUTHENTICATION_2_STEP, a)
}, azstack.authentication_processor = function (e, s) {
    var t = {fullname: s.fullname, azStackUserId: s.username, userId: s.userId};
    this.onAuthenticationCompleted(s.resultCode, t)
}, azstack.messageProcessor = function (e, s) {
    var t = this.getUserInfoAndRequestToServer(s.from, {service: e, body: s});
    return t ? (s.from = t, s.type = 1, void this.onMessagesSent(s)) : void azstack.log("DEBUG", "messageProcessor chua co info, gui yeu cau len server lay info")
}, azstack.messageReportProcessor = function (e, s) {
    var t = {msgIds: [s.msgId], from: s.from, type: 1, chatId: s.from, modified: s.time};
    this.deliveredMessagesProcessor(e, t)
}, azstack.messageGroupProcessor = function (e, s) {
    var t = s.group, a = this.groups.get(t);
    if (!a) {
        var r = new HashMap;
        return r.put(t, 1), void this.requestGroupInfoForPacket(r, e, s)
    }
    s.group = a, s.type = 2, this.onMessagesSent(s)
}, azstack.messageReportGroupProcessor = function (e, s) {
    var t = {msgIds: [s.msgId], from: s.from, type: 2, chatId: s.group, modified: s.modified};
    this.deliveredMessagesProcessor(e, t)
}, azstack.deliveredMessagesProcessor = function (e, s) {
    if (e = SERVICE_TYPE_DELIVERED_MESSAGES, delete s.senderId, !this.users.get(s.from)) {
        var t = new HashMap;
        return t.put(s.from, 1), void this.requestUserInfoForPacket(t, e, s)
    }
    if (s.from = this.users.get(s.from), 1 == s.type)delete s.chatId; else if (2 == s.type) {
        var a = s.chatId, r = this.groups.get(a);
        if (!r) {
            var o = new HashMap;
            return o.put(a, 1), void this.requestGroupInfoForPacket(o, e, s)
        }
        s.group = r
    }
    this.onMessagesDelivered(s)
}, azstack.have_message_processor = function (e, s) {
    var t = this.getUserInfoAndRequestToServer(s.from, {service: e, body: s});
    if (t) {
        var a = {msgId: s.msgId, msg: s.msg, type: 0, time: s.time};
        this.azSendMessageReport(s.from, a.msgId), this.onMessageReceived(t, a)
    }
}, azstack.haveMessageStickerProcessor = function (e, s) {
    var t = this.getUserInfoAndRequestToServer(s.from, {service: e, body: s});
    if (t) {
        var a = {url: s.url, catId: s.catId, imgName: s.imgName, msgId: s.id, msg: "Sticker", type: 3, time: s.created};
        this.azSendMessageReport(s.from, a.msgId), this.onMessageReceived(t, a)
    }
}, azstack.have_message_file_url_processor = function (e, s) {
    var t = this.getUserInfoAndRequestToServer(s.from, {service: e, body: s});
    if (t) {
        var a = {msgId: s.id, msg: "photo", type: s.type, url: s.url, time: s.created, fileName: s.fileName};
        this.azSendMessageReport(s.from, a.msgId), this.onMessageReceived(t, a)
    }
}, azstack.haveMessageGroupProcessor = function (e, s) {
    if (!this.users.get(s.from)) {
        var t = new HashMap;
        return t.put(s.from, 1), void this.requestUserInfoForPacket(t, e, s)
    }
    s.from = this.users.get(s.from);
    var a = this.groups.get(s.group);
    if (!a) {
        var r = new HashMap;
        return r.put(s.group, 1), void this.requestGroupInfoForPacket(r, e, s)
    }
    s.group = a, this.onGroupMessageReceived(s)
}, azstack.chat_typing_processor = function (e, s) {
    azstack.log("INFO", "chat typing from: " + s.from)
}, azstack.chat_group_typing_processor = function (e, s) {
    azstack.log("INFO", "chat group typing from: " + s.from + ", to group: " + s.group)
}, azstack.user_info_processor = function (e, s) {
    azstack.log("DEBUG", "user_info_processor, azStackUserID: " + s.username + ", userId: " + s.userId), this.callCallback("get_user_server_" + s.purpose, [s]), this.cacheUserInfo(s);
    var t = this.packet_queue.get(s.userId);
    if (t)for (; t.length > 0;) {
        var a = t.pop();
        void 0 != a && this.packetReceived(a.service, a.body)
    }
}, azstack.user_info_by_username_processor = function (e, s) {
    var t = s.userInfoList;
    for (this.callCallback("get_user_server_" + s.purpose, s.userInfoList); t.length > 0;) {
        var a = t.pop();
        azstack.log("DEBUG", "user_info_by_username from server, azStackUserID: " + a.username + ", userId: " + a.userId), this.cacheUserInfo(a);
        var r = this.send_packet_queue.get(a.username);
        if (r)for (; r.length > 0;) {
            var o = r.pop();
            if (void 0 != o && (o.service == SERVICE_TYPE_MESSAGE2 || o.service == SERVICE_TYPE_MESSAGE_FILE_URL || o.service == SERVICE_TYPE_MESSAGE_STICKER)) {
                if (!a.userId) {
                    azstack.log("DEBUG", "khong gui dc tin nhan vi user nay chua ton tai");
                    continue
                }
                o.body.to = a.userId, this.sendPacket(o.service, o.body), azstack.log("DEBUG", "Gui bu packet dang cho` trong queue"), azstack.log("DEBUG", o)
            }
        }
    }
}, azstack.getListUserInfoByListUserIDsProcessor = function (e, s) {
    for (; s.userInfoList.length > 0;) {
        var t = s.userInfoList.pop();
        this.cacheUserInfo(t)
    }
    var a = this.waitingPacketByListUserId.get(s.purpose);
    a && (this.waitingPacketByListUserId.remove(s.purpose), this.packetReceived(a.service, a.body))
}, azstack.getListGroupInfoProcessor = function (e, s) {
    for (; s.listGroups.length > 0;) {
        var t = s.listGroups.pop();
        this.groups.put(t.id, t)
    }
    var a = this.waitingPacketByListUserId.get(s.purpose);
    a && (this.waitingPacketByListUserId.remove(s.purpose), this.packetReceived(a.service, a.body))
}, azstack.get_list_modified_conversations_processor = function (e, s) {
    for (var t = new HashMap, a = new HashMap, r = 0; r < s.list.length; r++) {
        var o = s.list[r];
        if (delete o.ownerId, void 0 != o.lastMsg && (o.lastMsg.sender instanceof Object && (o.lastMsg.sender = o.lastMsg.sender.userId), this.users.get(o.lastMsg.sender) ? o.lastMsg.sender = this.users.get(o.lastMsg.sender) : t.put(o.lastMsg.sender, 1)), 1 == o.type)this.users.get(o.chatId) ? o.chatTarget = this.users.get(o.chatId) : t.put(o.chatId, 1); else if (2 == o.type) {
            var i = this.groups.get(o.chatId);
            i ? o.chatTarget = i : a.put(o.chatId, 1)
        }
    }
    return a.size() > 0 ? void this.requestGroupInfoForPacket(a, e, s) : t.size() > 0 ? void this.requestUserInfoForPacket(t, e, s) : void this.onListModifiedConversationReceived(s)
}, azstack.get_list_modified_messages_processor = function (e, s) {
    for (var t = new HashMap, a = 0; a < s.list.length; a++) {
        var r = s.list[a];
        this.users.get(r.receiverId) ? r.receiver = this.users.get(r.receiverId) : t.put(r.receiverId, 1), this.users.get(r.senderId) ? r.sender = this.users.get(r.senderId) : t.put(r.senderId, 1)
    }
    return t.size() > 0 ? void this.requestUserInfoForPacket(t, e, s) : void this.onListModifiedMessagesReceived(s)
}, azstack.get_list_unread_messages_processor = function (e, s) {
    for (var t = new HashMap, a = 0; a < s.list.length; a++) {
        var r = s.list[a];
        this.users.get(r.receiverId) ? r.receiver = this.users.get(r.receiverId) : t.put(r.receiverId, 1), this.users.get(r.senderId) ? r.sender = this.users.get(r.senderId) : t.put(r.senderId, 1)
    }
    return t.size() > 0 ? void this.requestUserInfoForPacket(t, e, s) : void this.onListUnreadMessagesReceived(s)
}, azstack.haveMsgFromMeProcessor = function (e, s) {
    if (!this.users.get(s.to)) {
        var t = new HashMap;
        return t.put(s.to, 1), void this.requestUserInfoForPacket(t, e, s)
    }
    s.to = this.users.get(s.to), s.chatType = 1, this.onMessageFromMe(s)
}, azstack.haveMsgGroupFromMeProcessor = function (e, s) {
    var t = this.groups.get(s.group);
    if (!t) {
        var a = new HashMap;
        return a.put(s.group, 1), void this.requestGroupInfoForPacket(a, e, s)
    }
    s.group = t, s.chatType = 2, delete s.from, this.onMessageFromMe(s)
}, azstack.makeGroupProcessor = function (e, s) {
    this.callCallback("makeGroup_" + s.msgId, s)
}, azstack.inviteToGroupProcessor = function (e, s) {
    this.callCallback("inviteToGroup_" + s.msgId, s)
}, azstack.leaveGroupProcessor = function (e, s) {
    this.callCallback("leaveGroup_" + s.msgId, s)
}, azstack.renameGroupProcessor = function (e, s) {
    this.callCallback("renameGroup_" + s.msgId, s)
}, azstack.applicationChangeStateProcessor = function (e, s) {
    this.onApplicationChangeState(s)
}, azstack.getGroupInfoProcessor = function (e, s) {
    this.callCallback("getGroupInfo_" + s.group, s)
}, azstack.makeGroupNotificationProcessor = function (e, s) {
    this.onMakeGroupNotification(s)
}, azstack.inviteToGroupNotificationProcessor = function (e, s) {
    this.onInviteGroupNotification(s)
}, azstack.leaveGroupNotificationProcessor = function (e, s) {
    this.onLeaveGroupNotification(s)
}, azstack.renameGroupNotificationProcessor = function (e, s) {
    this.onRenameGroupNotification(s)
}, azstack.deleteConversationProcessor = function (e, s) {
    this.callCallback("deleteConversation_" + s.chatId + "_" + s.type + "_" + s.lastTimeCreated, s), this.onDeleteConversation(s)
}, azstack.seenMessageProcessor = function (e, s) {
    this.onSeenMessage(s)
}, azstack.seenMessagesProcessor = function (e, s) {
    this.onSeenMessages(s)
}, azstack.deleteMessageProcessor = function (e, s) {
    this.callCallback("deleteMessage_" + s.senderId + "_" + s.msgId, s)
}, azstack.listChatGroupProcessor = function (e, s) {
    this.onListChatGroup(s)
}, azstack.chatGroupChangeAdminProcessor = function (e, s) {
    this.onChatGroupChangeAdmin(s)
}, azstack.chatListFilesProcessor = function (e, s) {
    for (var t = new HashMap, a = 0; a < s.list.length; a++) {
        var r = s.list[a];
        this.users.get(r.receiverId) ? r.receiver = this.users.get(r.receiverId) : t.put(r.receiverId, 1), this.users.get(r.senderId) ? r.sender = this.users.get(r.senderId) : t.put(r.senderId, 1)
    }
    return t.size() > 0 ? void this.requestUserInfoForPacket(t, e, s) : void this.onListFilesReceived(s)
}, azstack.onAuthenticationCompleted = function (e, s) {
    azstack.log("ERROR", "please implement method: azAuthentication")
}, azstack.onMessageReceived = function (e, s) {
    azstack.log("ERROR", "please implement method: azHaveMessage")
}, azstack.onGroupMessageReceived = function (e) {
    azstack.log("ERROR", "please implement method: onGroupMessageReceived"), azstack.log("INFO", "onGroupMessageReceived: " + e)
}, azstack.onListModifiedConversationReceived = function (e) {
    azstack.log("ERROR", "please implement method: azHaveMessage")
}, azstack.onListModifiedMessagesReceived = function (e) {
    azstack.log("ERROR", "please implement method: onListModifiedMessagesReceived")
}, azstack.onListUnreadMessagesReceived = function (e) {
    azstack.log("ERROR", "please implement method: onListUnreadMessagesReceived")
}, azstack.onMessagesDelivered = function (e) {
    azstack.log("ERROR", "please implement method: onMessagesDelivered")
}, azstack.onMessagesSent = function (e) {
    azstack.log("ERROR", "please implement method: onMessagesSent")
}, azstack.onMessageFromMe = function (e) {
    azstack.log("ERROR", "please implement method: onMessageFromMe")
}, azstack.onMakeGroupNotification = function (e) {
    azstack.log("ERROR", "please implement method: onMakeGroupNotification")
}, azstack.onInviteGroupNotification = function (e) {
    azstack.log("ERROR", "please implement method: onInviteGroupNotification")
}, azstack.onLeaveGroupNotification = function (e) {
    azstack.log("ERROR", "please implement method: onLeaveGroupNotification")
}, azstack.onRenameGroupNotification = function (e) {
    azstack.log("ERROR", "please implement method: onRenameGroupNotification")
}, azstack.onDeleteConversation = function (e) {
    azstack.log("ERROR", "please implement method: onDeleteConversation")
}, azstack.onSeenMessage = function (e) {
    azstack.log("ERROR", "please implement method: onSeenMessage")
}, azstack.onSeenMessages = function (e) {
    azstack.log("ERROR", "please implement method: onSeenMessages")
}, azstack.onDeleteMessage = function (e) {
    azstack.log("INFO", "please implement method: onDeleteMessage")
}, azstack.onListChatGroup = function (e) {
    azstack.log("INFO", "please implement method: onListChatGroup, packet: " + JSON.stringify(e))
}, azstack.onChatGroupChangeAdmin = function (e) {
    azstack.log("INFO", "please implement method: onChatGroupChangeAdmin, packet: " + JSON.stringify(e))
}, azstack.onListFilesReceived = function (e) {
    azstack.log("INFO", "please implement method: onListFiles, packet: " + JSON.stringify(e))
},azstack.onApplicationChangeState = function (e) {
    azstack.log("INFO", "please implement method: onApplicationChangeState, packet: " + JSON.stringify(e))
};