// ============================================================
// PUBG MASTER ROUTING PAC
// Stability + Session Control
// ============================================================

var PROXY  = "PROXY 46.185.131.218:20001";
var DIRECT = "DIRECT";
var BLOCK  = "PROXY 127.0.0.1:1";

// ================= SESSION STATE =================

var SESSION = {
    isp: null,
    lobbyNet: null,
    matchNet: null,
    activeMatch: false
};

// ================= UTILITIES =================

function isIPv6(ip){
    return ip && ip.indexOf(":") !== -1;
}

function normalizeIPv6(address){

    if(!address || address.indexOf(":") === -1)
        return address;

    var parts = address.split("::");
    var full = [];

    if(parts.length === 2){

        var left = parts[0] ? parts[0].split(":") : [];
        var right = parts[1] ? parts[1].split(":") : [];

        var missing = 8 - (left.length + right.length);

        full = left;

        for(var i=0;i<missing;i++)
            full.push("0000");

        full = full.concat(right);

    } else {

        full = address.split(":");

    }

    for(var j=0;j<full.length;j++){
        while(full[j].length < 4)
            full[j] = "0" + full[j];
    }

    return full.join(":").toLowerCase();
}

// ================= PUBG DOMAIN DETECTION =================

function isPUBG(host){

    host = host.toLowerCase();

    if(host.indexOf("pubg") !== -1) return true;
    if(host.indexOf("tencent") !== -1) return true;
    if(host.indexOf("krafton") !== -1) return true;
    if(host.indexOf("levelinfinite") !== -1) return true;
    if(host.indexOf("lightspeed") !== -1) return true;

    return false;
}

// ================= TRAFFIC CLASSIFICATION =================

function isLobbyTraffic(data){

    return /login|auth|lobby|gateway|queue|profile|inventory|shop|store|event|mission|friends|party|clan|rank|leaderboard|settings|config|patch|update|cdn|asset|download/i
        .test(data);
}

function isMatchTraffic(data){

    return /match|battle|classic|ranked|arena|tdm|teamdeathmatch|royale|war|payload|metro|zombie|relay|realtime|combat|survival|spectate|gamesvr/i
        .test(data);
}

// ================= NETWORK SEGMENT HELPERS =================

function getNet3(ip){

    if(isIPv6(ip))
        return ip.split(":").slice(0,3).join(":");

    return ip.split(".").slice(0,3).join(".");
}

function getNet4(ip){

    if(isIPv6(ip))
        return ip.split(":").slice(0,4).join(":");

    return ip.split(".").slice(0,3).join(".");
}

// ================= MAIN PAC FUNCTION =================

function FindProxyForURL(url, host){

    if(isPlainHostName(host))
        return DIRECT;

    if(!isPUBG(host))
        return DIRECT;

    var ip = "";

    try{
        ip = dnsResolve(host);
    } catch(e){
        ip = "";
    }

    if(!ip)
        return PROXY;

    var fullIP = ip;

    if(isIPv6(ip))
        fullIP = normalizeIPv6(ip);

    var data = (host + url).toLowerCase();

    var lobby = isLobbyTraffic(data);
    var match = isMatchTraffic(data);

    var net3 = getNet3(fullIP);
    var net4 = getNet4(fullIP);

    // ================= RESET AFTER MATCH =================

    if(!match && SESSION.activeMatch){
        SESSION.matchNet = null;
        SESSION.activeMatch = false;
    }

    // ================= LOBBY =================

    if(lobby){

        if(!SESSION.isp)
            SESSION.isp = net3;

        if(net3 !== SESSION.isp)
            return BLOCK;

        SESSION.lobbyNet = net3;

        return PROXY;
    }

    // ================= MATCH =================

    if(match){

        if(!SESSION.matchNet){

            if(!SESSION.isp)
                SESSION.isp = net3;

            if(net3 !== SESSION.isp)
                return BLOCK;

            SESSION.matchNet = net4;
            SESSION.activeMatch = true;
        }

        if(net4 !== SESSION.matchNet)
            return BLOCK;

        return PROXY;
    }

    return PROXY;
}
