const dotenv = require("dotenv");
dotenv.config();

const { MongoClient } = require('mongodb');
const uri = process.env.DB;
const mongo = new MongoClient(uri);
mongo.connect();

async function locate_member(mongo, member, tag, relay) {
  const result = await mongo.db("Storage").collection("Users").findOne({ _id: member });

  if (result) {
    //retrieve user info
    relay.send(tag + " found " + result.flags.toString() + " flag(s) in total!");
  } else {
    //respond user not found
    relay.send(tag + " found no flags yet!");
  }
}

const Discord = require('discord.js');
const client = new Discord.Client({
  allowedMentions: { parse: ['users'] },
  intents: [
    'GUILDS',
    'GUILD_EMOJIS_AND_STICKERS',
    'GUILD_INTEGRATIONS',
    'GUILD_INVITES',
    'GUILD_MESSAGE_REACTIONS',
    'GUILD_MESSAGE_TYPING',
  ],
});
client.login(process.env.TOKEN);

client.on('ready', init => {
  client.user.setActivity("CTF Challenges", {
    type: "PLAYING",
  });
  console.log("muahahaha! SC" + "B{c0NsoL3" + "_doT_" + "log}")
});

//hacking gifs
hack_success = ["https://c.tenor.com/esCBwJ7Tq4UAAAAd/pc-hack.gif", "https://c.tenor.com/VrzXhtoSwcsAAAAd/hacker-typing.gif", "https://c.tenor.com/-SV9TjUGabMAAAAC/hacker-python.gif", "https://c.tenor.com/FUnjZyMefVQAAAAC/hackintothemainframe-hack.gif"]
hack_fail = ["https://c.tenor.com/W93VsNUYX6MAAAAd/sa-tis-c.gif", "https://c.tenor.com/qsthhHhdjsQAAAAC/error-windows.gif", "https://c.tenor.com/DOQXf3CfCokAAAAC/error-accesdenied.gif", "https://c.tenor.com/pBX3M0mJUYQAAAAd/monitor-program.gif", "https://c.tenor.com/MF7edIrkQzUAAAAC/firewall-benrob0329.gif"]

//make tags
var tag_trigger = [];
var tag_reply = [];

function tag_create(val, val2) {
  tag_trigger.push(val);
  tag_reply.push(val2);
}

tag_create("support", "Please open a ticket in <#883543778877644851> for assistance");
tag_create("flag", "SCB{C@n_Y0u_F1nD_3_0th3r_Fl@gs?}");
tag_create("team", "**Red team** is about offensive security like finding vulnerabilities and reporting them , while **Blue team** is about defensive security like patching systems with security bugs");
tag_create("ctf", "What is a CTF?\nhttps://discord.com/channels/837579283991887892/856450787583852575/882212949203247104");
tag_create("tools", "Some useful tools for CTFs\nhttps://discord.com/channels/837579283991887892/856450787583852575/882212878441127947");
tag_create("submit", "Want to submit those flags you found everywhere?\nhttps://sg-cyber-bot.miniware.repl.co/?page=verify");
tag_create("ask", "https://dontasktoask.com/");

client.on('message', msg => {
  if (msg.author.bot == true) {
    return;
  } else if (msg.channel.type === 'dm') {
    msg.channel.send("Feel free to open a ticket in the server for assistance!")
    return;
  } else if (msg.content.toLowerCase().startsWith("&")) {
    check(msg);
  }
});

function check(msg) {
  try{
  const cmd = msg.content.substr(1);
  const command = cmd.toLowerCase();
  if (command == 'ping') {
    var crash = Math.floor(Math.random() * 11);
    if (crash == 1) {
      msg.channel.send(process.env.DDOS);
    } else {
      msg.channel.send("pong");
    }
  } else if (command.startsWith('retrieve ')) {
    const mention = command.substr(9);
    client.guilds.cache.get('837579283991887892').members.fetch(mention).then(member => {
      locate_member(mongo, mention, member.user.tag, msg.channel);
    }).catch(error => {
      msg.channel.send("That ID does not belong to a member!");
    });
  } else if (command == 'retrieve') {
    locate_member(mongo, msg.author.id, msg.author.tag, msg.channel);
  } else if (command == 'lb') {
    //leaderboard stuff
    msg.channel.send("Visit this link to view the leaderboard\nhttps://sg-cyber-bot.miniware.repl.co/?page=dashboard")
  } else if (command == 'help') {
    msg.channel.send({
      embed: {
        title: "SG Cyber Bot",
        description: "Prefix: &\n[https://sgcyberbot.com/](https://SG-Cyber-Bot.miniware.repl.co)",
        color: "#2E5984",
        footer: {
          text: "Brought to you by SG Cyber Youth Swag Team"
        },
        thumbnail: {
          url: 'https://cdn.discordapp.com/icons/837579283991887892/fd8ec3c585fad1329a196b7aa378f5b0.webp',
        },
        fields: [
          {
            name: 'General',
            value: 'help - Sends this message\nping - Responds with pong\nhack @person - Fake hacking',
            inline: false,
          }, {
            name: 'Tag',
            value: 'tags - Shows all tags\ntag <tag> - Display tag',
            inline: false,
          }, {
            name: 'Flag',
            value: 'retrieve [id] - View progress\nlb - View leaderboard',
            inline: false,
          }, {
            name: 'Role',
            value: 'ycep - Get the YCEP role',
            inline: false,
          }
        ]
      }
    });
  } else if (command.startsWith('hack ')) {
    var mention = ""

    if (command.search("@") != -1 && command.search("<") != -1 && command.search(">") != -1) {
      mention = command.substr(5);
    } else if (command.substr(5).replace(/[0-9]/gi, "") == "") {
      mention = "<@" + command.substr(5) + ">";
    } else {
      return;
    }

    var outcome = Math.floor(Math.random() * 6) + 1;

    var display_img = "";
    var display_msg = "";
    var display_main = "";

    const success_msg = ["You have bypassed your target's firewall and installed a trojan on their computer!", "Your target fell for your nitro scam and you gained control of his discord account!", "Your target installed your app infected with malware on their mobile device and you gained control of it!", "You logged into your target's computer with default credentials and it worked!", "Your target fell victim to your phishing scam and you have access to their bank account!", "You found a XXS vulnerability in your target's website and defaced it!", "You found a SQL injection vulnerability in your target's website and gained access to their database!"];
    const fail_msg = ["What a dumb script kiddie, go get a life.", "Get better next time, at least you are not caught yet.", "Just give up already, there are far better things to do.", "Why waste your hacking talent by using it for illegal purposes when you can use it to find bugs for bounty?", "Stop wasting your time, you should get a proper job and make an honest living.", "Don't be sad, here's a flag: ||" + process.env.HACKER + "||", "Such a failure, you will never be a professional hacker."];

    if (outcome == 1) {
      display_main = "SUCCESS";
      display_msg = success_msg[Math.floor(Math.random() * success_msg.length)]
      display_img = hack_success[Math.floor(Math.random() * hack_success.length)]
    } else {
      display_main = "FAILED";
      display_msg = fail_msg[Math.floor(Math.random() * fail_msg.length)]
      display_img = hack_fail[Math.floor(Math.random() * hack_fail.length)]
    }
    msg.channel.send({
      embed: {
        color: "#2E5984",
        title: display_main,
        description: display_msg.replace(/your target/gi, mention),
        image: {
          url: display_img,
        }
      }
    });
  } else if (command == 'tags') {
    var n = 0;
    var list = ""
    while (n < tag_trigger.length) {
      list = list + "\n" + (n + 1).toString() + ") " + tag_trigger[n];
      n = n + 1;
    }
    msg.channel.send({
      embed: {
        title: "Available tags",
        description: list,
        color: "#2E5984"
      }
    });
  } else if (command.startsWith('tag ')) {
    var mention = command.substr(4);
    var n = 0;
    var list = ""
    while (n < tag_trigger.length) {
      if (mention == tag_trigger[n]) {
        msg.channel.send(tag_reply[n]);
        return;
      }
      n = n + 1;
    }
    //ignore the stuff below
  }else if (command.toLowerCase()=="ycep" && msg.guild.id == "837579283991887892"){
    if (!msg.member.roles.cache.some((role) => role.id === '984049047256047666')){
      msg.member.roles.add('984049047256047666');
      msg.channel.send("Given you the YCEP role!");
    }else{
      msg.member.roles.remove('984049047256047666');
      msg.channel.send("Took away your YCEP role!");
    }
   msg.react("✅");
  }/*else if (command=="aycepcctf" && msg.guild.id == "837579283991887892"){
    msg.lineReplyNoMention("Usage: `aycepcctf [hash]`\nE.g. `q!aycepcctf 5E884898DA28047151D0E56F8DC6292773603D0D6AABBDD62A11EF721D1542D8`");
  }else if (command.toLowerCase().startsWith("aycepcctf ") && msg.guild.id == "837579283991887892"){
    const mention = command.substr(10);
    const password = process.env.PASS;
    if (mention.toLowerCase() == createHash('sha256').update(password+"{"+msg.author.id+"}").digest('hex')){
      msg.member.roles.add('917729234863140926');
      msg.channel.send("You know the secret!")
      msg.react("🤫");
    }else{
      msg.member.roles.remove('917729234863140926');
      msg.channel.send("You don't know the secret!")
      msg.react("🤫");
    }
  }else if (command.toLowerCase()=="join" && msg.guild.id == "837579283991887892"){
    msg.lineReplyNoMention("Usage: `join [aycepctf grp]`\nE.g. `q!join 1`");
  }else if (command.toLowerCase().startsWith("join ") && msg.guild.id == "837579283991887892"){
    const grps = ["919465446183415858","919465598730260550","919465685141295136","919465713037606943","919465739335905311","919465770067574814","919465793849286706","919465823339446283","919465853077061642","919465878070898688"];
    if (msg.member.roles.cache.some((role) => role.id === '917729234863140926')){
      //join
      const mention = command.substr(5);
      const grp = Number(mention)-1;
      if (isNaN(grp) || grp > 9 || grp < 0){
        msg.channel.send("Please enter a valid group");
        return;
      }
      msg.member.roles.add(grps[grp]);
      msg.channel.send("You joined group "+mention+"!");

      //reset
      var i = 0;
      while (i < grps.length){
        if (i != grp){
          msg.member.roles.remove(grps[i]);
        }
        i = i +1;
      }
    }else{
      msg.channel.send("You should know the secret first!");
    }
    msg.react("🤙");

    SCB{Ch3ck_+h3_c0mm3nts!}
  }*/
  }catch(err){}
}
