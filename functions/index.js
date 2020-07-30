'use strict'
const functions = require('firebase-functions');
const get = require('./get.js')
const show = require('./show.js')
/* momentjs: required because due to timezone differences, 'today' might mean a sunday for user and saturday for server' */
var moment = require('moment');
const { dialogflow, Image, Button, BasicCard, SimpleResponse,SignIn,Permission,Suggestions,Carousel} = require('actions-on-google');
const app = dialogflow({
                            debug : true,
                           // clientId : "SECRET",
                    });
const admin=require('firebase-admin');
admin.initializeApp();
const db=admin.firestore(); 
const uuidv1 = require('uuid/v1');
const suggest = {
    'DSCHeritage'   :   'Whats new in DSC Heritage',
    'Rotaract'      :   'Whats new in RC-HITK',
    'NSS'      :   'Whats new in Nss-HITK',
    'Debating Society' : `Whats new in DEBSOC`,
    'Geeks United'  :   'Whats new in Geeks United',
    'ACM-HITK'      :   'Whats new in ACM United',
    'Fashion'       :   'Whats new in Fashion',
    'Gaming'        :   'Whats new in Gaming',
    'Sports'        :   'Whats new in Sports',
    'Ed-Cell'       :   'Whats new in ED-Cell',
    'Resonance'         : 'Whats new in Resonance',
    'Ghungroo'          : 'Whats new in Ghungroo',
    'Anubhav'           : 'Whats new in Anubhav',
    'Atmadweep'         : 'Whats new in Atmadweep',
    'Prabhasvana'       : 'Whats new in Prabhasvana',
    'Literary'          : 'Whats new in Literary',
    'News'              : 'Whats new in News',
    'Flyers'            : 'Whats new in Flyers',
    'Science'           : 'Whats new in Science',
    'HEGA'              : 'Whats new in HEGA',
};

const SELECTED_ITEM_RESPONSES = {
    'DSCHeritage'       : 'Developer Student Clubs (DSC) is a Google Developers program for university students to learn mobile and web development skills. ',
    'Rotaract'          : 'RCHITK, where we nourish skills and cherish smiles. For our exertion and passion limitations for society and its welfare, or for a cause, one can probably say "Sky is the limit".',
    'NSS'          : `The National Service Scheme (NSS) is an Indian government-sponsored public service program conducted by the Ministry of Youth Affairs and Sports of the Government of India.  Aimed at developing student's personality through community service, NSS is a voluntary association of young people in Colleges and Universities  level working for a campus-community linkage.`,
    'Debating Society'  : `The official Debating Club of HITK, which helps students learn and participate in both Oxford Style and Parliamentary Debates.`,
    'Geeks United'      : `Sorry Description Not available `,
    'ACM-HITK'          : `ACM HITK is the group for all techies out there. Let it be learning a new programming language, competing in a coding tournament, or researching into the depths of machine learning, our Chapter keeps you up to date with all the developments in the field of computing !`, 
    'Fashion'           : `Sorry Description Not available `, 
    'Gaming'            : `The official Gaming Club of HITK. From competitive to casual- we know them all. Think you have a knack for these? Come find us, you will not be disappointed. `, 
    'Sports'            : `Sorry Description Not available `, 
    'Ed-Cell'           : 'Sorry Description Not available',
    'Resonance'         : 'Sorry Description Not available',
    'Ghungroo'          : 'Sorry Description Not available',
    'Anubhav'           : 'Sorry Description Not available',
    'Atmadweep'         : 'Sorry Description Not available',
    'Prabhasvana'       : 'Sorry Description Not available',
    'Literary'          : 'Sorry Description Not available',
    'News'              : 'Sorry Description Not available',
    'Flyers'            : 'Sorry Description Not available',
    'Science'           : 'Sorry Description Not available',
    'HEGA'              : 'Sorry Description Not available',
};
app.intent('All_clubs', (conv) => {
    if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
      conv.ask('Sorry, try this on a screen device or select the ' +
        'phone surface in the simulator.');
      return;
    } 
    conv.ask('Here is the list of all clubs...'); 
    conv.ask(new Carousel({
      items: {
         'DSCHeritage': {
          synonyms: [
            'DSC',
          ],
          title: 'Developer Student Clubs Heritage',
          image: new Image({
            url: 'https://image.ibb.co/nQPG9p/dsc.jpg',
            alt: 'DSC',
          }),
        },
        
         'Rotaract': {
          synonyms: [
            'RC-HITK',
            'RC',
        ],
          title: 'Rotaract',
          image: new Image({
            url: 'https://image.ibb.co/nJWJN9/rc.jpg',
            alt: 'Rotaract',
          }),
        },
        'Debating Society': {
            synonyms: [
              'DEBSOC',
          ],
            title: 'Debating Society',
            image: new Image({
              url: 'https://thumb.ibb.co/f1o9vU/IMG_20180912_WA0000_1.jpg',
              alt: 'DEBSOC',
            }),
          },
          'NSS': {
            synonyms: [
              'Nss-HITK',
          ],
            title: 'National Service Scheme',
            image: new Image({
              url: 'https://image.ibb.co/c1RGs9/20180912_202722_1.jpg',
              alt: 'NSS',
            }),
          },
          'ACM-HITK': {
            synonyms: [
              'ACM',
          ],
            title: 'Advanced Computer Machinery',
            image: new Image({
              url: 'https://image.ibb.co/cLspUp/IMG_20180912_WA0010_1.jpg',
              alt: 'ACM',
            }),
          },
          'Geeks United': {
            synonyms: [
              'GEEKS',
          ],
            title: 'Geeks United',
            image: new Image({
              url: 'https://image.ibb.co/ijLbs9/20180912_204939.jpg',
              alt: 'Geeks',
            }),
          },
          'ED-Cell': {
            synonyms: [
              'EDC',
          ],
            title: 'Entrepreneurship Development Cell',
            image: new Image({
              url: 'https://preview.ibb.co/eOaDpp/IMG_20180913_003737.jpg',
              alt: 'EDC',
            }),
          },
          'Gaming': {
            synonyms: [
              'Game',
          ],
            title: 'Gaming Club',
            image: new Image({
              url: 'https://preview.ibb.co/eOaDpp/IMG_20180913_003737.jpg',
              alt: 'Gaming',
            }),
          },
          'Sports': {
            synonyms: [
              'Sports',
          ],
            title: 'Sports Club',
            image: new Image({
              url: 'https://preview.ibb.co/eOaDpp/IMG_20180913_003737.jpg',
              alt: 'Sports',
            }),
          },
          'Fashion': {
            synonyms: [
              'Fashion',
          ],
            title: 'Fashion Club',
            image: new Image({
              url: 'https://preview.ibb.co/eOaDpp/IMG_20180913_003737.jpg',
              alt: 'Fashion',
            }),
          },
       },
    }));
    conv.ask(new Suggestions('SHOW MORE CLUBS'));
    });
    app.intent('Clubsf', (conv) => {
        if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
          conv.ask('Sorry, try this on a screen device or select the ' +
            'phone surface in the simulator.');
          return;
        } 
        conv.ask('Here are the remaining clubs...'); 
        conv.ask(new Carousel({
          items: {
            'Prabhasvana': {
                synonyms: [
                  'Prabhasvana',
              ],
                title: 'Prabhasvana Photography film and painting club',
                image: new Image({
                  url: 'https://preview.ibb.co/eOaDpp/IMG_20180913_003737.jpg',
                  alt: 'Prabhasvana',
                }),
              },
              'Literary': {
                synonyms: [
                  'Literary',
              ],
                title: 'Literary Club',
                image: new Image({
                  url: 'https://preview.ibb.co/eOaDpp/IMG_20180913_003737.jpg',
                  alt: 'Literary',
                }),
              },
              'News': {
                synonyms: [
                  'News',
              ],
                title: 'News Club',
                image: new Image({
                  url: 'https://preview.ibb.co/eOaDpp/IMG_20180913_003737.jpg',
                  alt: 'news',
                }),
              },
              'Flyers': {
                synonyms: [
                  'Flyers',
              ],
                title: 'Flying Club',
                image: new Image({
                  url: 'https://preview.ibb.co/eOaDpp/IMG_20180913_003737.jpg',
                  alt: 'Flying',
                }),
              },
              'Science': {
                synonyms: [
                  'science',
              ],
                title: 'Science Club',
                image: new Image({
                  url: 'https://preview.ibb.co/eOaDpp/IMG_20180913_003737.jpg',
                  alt: 'science',
                }),
              },
              'HEGA': {
                synonyms: [
                  'HEGA',
              ],
                title: 'HEGA CLub',
                image: new Image({
                  url: 'https://preview.ibb.co/eOaDpp/IMG_20180913_003737.jpg',
                  alt: 'HEGA',
                }),
              },
              'Resonance': {
                synonyms: [
                  'resonance',
              ],
                title: 'Resonance The Music Club',
                image: new Image({
                  url: 'https://preview.ibb.co/eOaDpp/IMG_20180913_003737.jpg',
                  alt: 'Resonance',
                }),
              },
              'Ghungroo': {
                synonyms: [
                  'ghungroo',
              ],
                title: 'Ghungroo The Dance Club',
                image: new Image({
                  url: 'https://preview.ibb.co/eOaDpp/IMG_20180913_003737.jpg',
                  alt: 'Ghungroo',
                }),
              },
              'Anubhav': {
                synonyms: [
                  'anubhav',
              ],
                title: 'Anubhav The Drama Club',
                image: new Image({
                  url: 'https://preview.ibb.co/eOaDpp/IMG_20180913_003737.jpg',
                  alt: 'Anubhav',
                }),
              },
              'Atmadweep': {
                synonyms: [
                  'atmadweep',
              ],
                title: 'Atmadweep',
                image: new Image({
                  url: 'https://preview.ibb.co/eOaDpp/IMG_20180913_003737.jpg',
                  alt: 'atmadweep',
                }),
              },
            },
        }));
    });
    app.intent('actions.intent.OPTION', (conv, params, option) => {
      let response = 'You did not select any item';
      let suggs = 'Show me all clubs';
      if (option && SELECTED_ITEM_RESPONSES.hasOwnProperty(option)) {
        response = SELECTED_ITEM_RESPONSES[option];
        suggs = suggest[option]
      }
      conv.ask(response);
      conv.ask(new Suggestions(suggs));
    });

const locations = {
    'Principal Office': 'CME Ground Floor',
    'Admin Office': 'CME Ground Floor',
    'TPO Office': 'CME 003, Ground Floor',
    'CSE HOD': 'ICT 3rd Floor, Just beside the Stairs',
    'CSE FR': 'CB 6th Floor',
    'CSE Department': 'ICT 3rd Floor',
    'ECE HOD': 'ICT 4th Floor, Just beside the Stairs',
    'ECE FR': 'CB 5TH FLOOR',
    'ECE Department': 'ICT 4TH FLOOR',
    'IT HOD': 'ICT 2nd Floor, Just beside the Stairs',
    'IT FR': 'ICT 2nd Floor',
    'IT Department': 'ICT 2nd FLOOR',
    'CHE HOD': 'CB 2nd FLOOR',
    'CHE FR': 'CB 209',
    'CHE Department': 'CB 2nd FLOOR',
    'PHY HOD': 'CB 1st Floor',
    'PHY FR': 'CB 1ST FLOOR',
    'PHY Department': 'CB 1ST FLOOR',
    'MTH HOD': 'ICT 6TH FLOOR',
    'MTH FR': 'ICT 6th FLOOR',
    'MTH Department': 'ICT 6TH FLOOR',
    'HMTS HOD': 'ICT 2nd Floor',
    'HMTS FR': 'ICT 2nd Floor',
    'HMTS Department': 'In your own class',
    'ME HOD': 'CME 1st Floor',
    'ME FR': 'CME 1st Floor',
    'ME Department': 'CME 1st Floor',
    'Civil HOD': 'CME 2nd Floor',
    'Civil FR': 'CME 2nd Floor',
    'Civil Department': 'CME 2nd Floor',
    'Elec HOD': 'CME 4th Floor',
    'Elec FR': 'CME 4th Floor',
    'Elec Department': 'CME 4th and 5th Floors',
    'AEIE HOD': 'ICT 1st FLoor',
    'AEIE Department': 'ICT 1st Floor',
    'AEIE FR': 'ICT 1st Floor',
    'Workshop': 'CME Basement',
    'BT HOD': 'CB 4th FLoor',
    'BT Department': 'CB 4th Floor',
    'BT FR': 'CB 4th Floor',

};

const usersCollection = db.collection("users");
const clubsCollection = db.collection("clubs");
const quizcollection = db.collection('Heritage_Quiz');

app.intent('Who Is', (conv, { Person }) => {
  
     return db.collection("contributor").doc(Person).get()
    .then((snapshot)=>{
      
        const {btnTitle,btnUrl,imgAlt,imgUrl,description} = snapshot.data();
        conv.ask(new SimpleResponse({
            speech: description,
            text: "Here :"
        }));
        // conv.ask(`${description}`);
        conv.ask(new BasicCard({
            text:description,
            
            
            buttons: new Button({
                title : btnTitle,
                url : btnUrl,
            }),
            image:new Image({
                url : imgUrl,
                alt : imgAlt,
            }),
            // display : "DEFAULT",
        })) ;
        return;
             
            
     }).catch((e)=>{
         conv.ask(`Sorry I think that ${Person} is not a contributor of heritage helper`);
     })
   
});

// Save Stream, not to be triggered directly. Use get.stream(conv)
app.intent('save stream', (conv, {stream}) => {
	conv.ask("Which section ?")
	conv.ask(new Suggestions(['A','B','C']));
	console.log(conv.contexts.get('save_stream')); 
});

app.intent('save stream - section', (conv, {section}) => {
	conv.ask("And which year ?");
	conv.ask(new Suggestions(['1st','2nd','3rd','4th']));
});

app.intent('save stream - year', (conv, {year}) => {
	conv.ask("Thanks!");

	console.log("Saving user data");
	var userRef = db.collection("users").doc(conv.user.storage.userId);
	var contextParam = conv.contexts.get('save_stream').parameters
	console.log(contextParam);
	return userRef.set({
			stream: contextParam.stream,
			stream_year: contextParam.stream_year,
			stream_section: contextParam.stream_section,
			stream_full: contextParam.stream+" "+contextParam.stream_section+" "+contextParam.stream_year
	}, {merge:true}).then(()=>{
	var callback = contextParam.callback;
	return show[callback](conv);
	})
});



// Routine

app.intent('routine', (conv, { date }) => {
	let day;
	if (date){
		date = moment.parseZone(date); 
		day = date.day();
	}
	else
		day = -1;
	console.log("Setting date: "+ date);
	console.log("Setting day: "+ day);
	let userId;
	if ('userId' in conv.user.storage) { // Returning user
		return show.routine(conv, day);
	}
	else { //New user
		userId = uuidv1();
		conv.user.storage.userId = userId;
		conv.ask("Looks like I don't exactly know where you belong.");
		return get.stream(conv, 'routine', day);
	}
});

app.intent('actions_intent_OPTION-handler', (conv, params, option) => {
	console.log("Entered list handler");
	if (option.split('-')[0] === "Period"){ //Routine's list item
		conv.close("There's nothing in here, yet.  \nBy the way, have you completed your assignments ? ")
	}
	else
		conv.ask("You seem lost. Try something else");
});


//QUIZ STARTS HERE ____________________________________________________________________________________________________
var sz;
var wpn = 0,cpn = 0;
var wp = [`I'm so sorry. You're wrong. The answer I was looking for is `,`Unfortunately no. The correct answer is `,`Hmm. No. Sorry. The answer is, in fact, `,`Nope. Good try though. The real answer is `,'Better luck next time. The correct answer is '];
var cp = [`That's the right answer. You got it. `,`Are you serious? Of course, that's right.`,`Brilliant. You got it.`,`Great job. Way to go!`,`The judges say 'yes'! You got it.`,'Congrats that was correct.'];
var s,c,q,CANS1,CANS2,CANS3,CANS4,UANS;
var aq = [];
app.intent('Quiz', (conv) => {
    count();
    s = 0;
    aq = [];
    c = 0;
    q = aq[c] = Math.floor((Math.random() * (sz - 1))) + 1; 
    conv.ask("That’s something I like doing, playing the presenter of a game. Welcome to the Heritage Trivia Quiz. Let's get started with the first question. ");
    const termRef = quizcollection.doc(`${q}`);
    return termRef.get()
    .then((snapshot) => {
      const {Qs,ans1,ans2,ans3,ans4} = snapshot.data();
      CANS1 = ans1;
      CANS2 = ans2;
      CANS3 = ans3;
      CANS4 = ans4;  
      return conv.ask(`${Qs} .`);
    }).catch((e) => {
      console.log('error:', e);
      
    });
});
app.intent('Quizfb1', (conv) => {
    UANS = `${conv.input.raw}`;
    if(CANS1.toLowerCase() === UANS.toLocaleLowerCase() || CANS2.toLowerCase() === UANS.toLocaleLowerCase() || CANS3.toLowerCase() === UANS.toLocaleLowerCase() || CANS4.toLowerCase() === UANS.toLocaleLowerCase())  
    {
        s++;
        cpn = Math.floor((Math.random() * 5));
        conv.ask(cp[cpn]);
    }
    else
    {
        wpn = Math.floor((Math.random() * 5));
        conv.ask(wp[wpn] + CANS1 +'. ');
    }
    c++;
    if(c === 5)
    {
        conv.close('Your game is over. Your total score is ' + s + '. Thanks for playing see you again...');
    }
    else {
        var flag = 0;
        for(;;)
        {
            flag = 0;
            q = Math.floor((Math.random() * (sz - 1))) + 1;
            for(var i = 0;i<=aq.length-1;i++)
            {
                console.log(aq[i] + ' ' + q);
               if(q === aq[i])
               {
                   flag = 1;
                     
               }
            }
            if(flag === 0)
             break;
        }
        aq[c] = q;
        const termRef = quizcollection.doc(`${q}`);
        return termRef.get()
        .then((snapshot) => {
            const {Qs,ans1,ans2,ans3,ans4} = snapshot.data();
            CANS1 = ans1;
            CANS2 = ans2;
            CANS3 = ans3;
            CANS4 = ans4;  
      return conv.ask(`Let's go to the next question...  ${Qs} . `);
    }).catch((e) => {
      console.log('error:', e);
    });
    }
});
function count() {
    db.collection('Heritage_Quiz').get().then(snap => {
        sz = snap.size ;
        return sz;
    }).catch((e) => {
        console.log(e);
    })
}

//QUIZ ENDS HERE __________________________________________________________________________________________________

app.intent('Default Welcome Intent',(conv) => {
    conv.ask(`I am the Heritage Helper. Your assistant to all things Heritage. You can ask me questions like where can I find CSE hod , what's new in DSC Heritage`);
    conv.ask(new Suggestions([`What's new in DSC`, 'Where is CSE HOD',`Show me all clubs`,`Play Heritage Quiz`,`How do I join DSCHeritage`]));
});

app.intent('Where is', (conv, { Location }) => {
    console.log(Location);
    console.log(locations[Location]);
    const requiredLocation = locations[Location];
    conv.close(`You can find ${Location} at ${requiredLocation}`);
});

app.intent('How To', (conv, { Activity }) => {
    console.log(Activity);
    let result;
    if (Activity === 'Join DSC') {
        conv.ask('Sure! Welcome to the Family!');
        if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
            conv.ask('Sorry, try this on a screen device');
            return;
        }
        result = new BasicCard({
            text: 'Amazing! At Developer Student\'s club, we learn together and ' +
                'implement our learnings in building many amazing projects' + 'Simply introduce yourself to this' +
                ' WhatsApp Group and we will guide you through the rest!',
            buttons: new Button({
                title: 'DSC WhatsApp Group',
                url: 'https://chat.whatsapp.com/2QXwM5bteaG0cy2eOdDXyI',
            }),
            image: new Image({
                url: 'https://image.ibb.co/jSb1G8/4d9c3e22_8489_4e52_bb47_1f12cb61436b.jpg',
                alt: 'Developer Students Club India',
            }),
        });
       
    }
    else {
        result = 'I really don\'t know yet. Will try to do better next time.';
    }
    console.log(result);
    conv.close(result);
});
// app.intent("get sign in",(conv)=>{
//     conv.ask(new SignIn(`Just Signing you in`));
// })

// // Create a Dialogflow intent with the `actions_intent_SIGN_IN` event.
// app.intent('Get Signin',(conv,params,signin)=>{
//     if(signin.status === 'OK'){
//         const payload = conv.user.profile.payload;
//         const {email} = conv.user;

//         conv.ask(`Hi ${payload.name} I am just taking your email ${email}`);
//         db.collection(`user`).doc(email).set({
//             name : payload.name,
//             department : "CSE",
//             passout_year : 2020,
//             section : "C",
//             group : 2,
//             club : ['DSC Heritage','RC-HITK'],
//             mail : email,
//             // name : "some name",
            
//         }).then(()=>{
//             console.log(`Document successfully written`);
//             return;
//         }).catch((e)=>{
//             console.log(`ERROR`);
//         })
//     }
//     else{
//         conv.ask(`Hey it seems like this is your first time, Please say Sign In so that I can know you better`);
//     }
// })
app.intent('What\'s new',(conv,{Club})=>{
   
   return db.collection('clubs').doc(Club).get()
    .then((snapshot)=>{
      
       const {Details,img_url,clubSubtitle,clubTitle,clubButtonTitle,clubButtonUrl,
                        clubImageAlt} = snapshot.data();
       conv.ask(`${Details} And ${img_url}`);
       conv.ask(new BasicCard({
           text:Details,
           subtitle : clubSubtitle,
           title : clubTitle,
           buttons: new Button({
               title : clubButtonTitle,
               url : clubButtonUrl,
           }),
           image:new Image({
               url : img_url,
               alt : clubImageAlt,
           }),
           display : "CROPPED",
       })) ;
            
            return;
    }).catch((e)=>{
        conv.ask(`Sorry couldn't understood you`);
    })
})




exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);



