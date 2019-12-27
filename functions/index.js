const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sendgridemail = require('@sendgrid/mail');
admin.initializeApp(functions.config().firebase);

const createNotification = ((notification) => {
  return admin.firestore().collection('notifications')
    .add(notification)
    .then(doc => console.log('notification added', doc));
});
const MY_SENDGRID_API_KEY="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"
sendgridemail.setApiKey(MY_SENDGRID_API_KEY);

exports.siteCreated = functions.firestore
  .document('sites/{siteId}')
  .onCreate(doc => {
    const site = doc.data();
    const notification = {
      content: 'Added a new site',
      user: `${site.authorName}`,
      time: admin.firestore.FieldValue.serverTimestamp(),
      avatarURL: `${site.authorPhotoURL}`,
      address: `${site.address}`,
      title:`${site.title}`,
      uid:`${site.authorId}`
    }
    const msgbody = {
      to: site.authorEmail,
      from: 'auto-no-reply@vnsachvaxanh.com',
      templateId: 'd-d0621c0561104c8c980b8492620d6f5d',
      "dynamic_template_data":{
        text:"Cảm ơn "+site.authorName+" đã tạo sự kiện Việt Nam Sạch & Xanh. Sự Kiện của bạn đang được xử lý.",
          subject:  'Cám Ơn Tạo Sự Kiện',}

  };
    return createNotification(notification).then(()=>{
      return sendgridemail.send(msgbody)
      .then(() => console.log('owner  sent success') )
      .catch(err => console.log(err) )
    });

});
exports.siteApproved = functions.firestore
  .document('sites/{siteId}')
  .onWrite(
  //   field('pending','CHANGED', (change, context) => {
  //   console.log('pending changed',change);
  //   // ... Your implementation here
  // },
    doc => {
    const site = doc.data();
    const notification = {
      content: 'điạ chỉ được xách nhận',
      user: `${site.authorName}`,
      time: admin.firestore.FieldValue.serverTimestamp(),
      avatarURL: `${site.authorPhotoURL}`,
      address: `${site.address}`,
      title:`${site.title}`,
      uid:`${site.authorId}`
    }
    var msgbody= null
    if(site.pending==false){
    msgbody = {
      to: site.authorEmail,
      from: 'auto-no-reply@vnsachvaxanh.com',
      templateId: 'd-d0621c0561104c8c980b8492620d6f5d',
      "dynamic_template_data":{
        text:"Cảm ơn "+site.authorName+" đã tạo sự kiện Việt Nam Sạch & Xanh. Sự Kiện của bạn đã được xác nhận.",
          subject:  'Sự Kiện của bạn đã được xác nhận',}
      }
      if(site.done==true){
        msgbody = {
          to: site.authorEmail,
          from: 'auto-no-reply@vnsachvaxanh.com',
          templateId: 'd-d0621c0561104c8c980b8492620d6f5d',
          "dynamic_template_data":{
            text:"Cảm ơn "+site.authorName+". Sự Kiện của bạn đã kết thúc.",
              subject:  'Sự Kiện của bạn đã kết thúc',}
          }
      }
           
         

  };
    return createNotification(notification)
    .then(()=>{
      if (msgbody){
      return sendgridemail.send(msgbody)
      .then(() => console.log('owner  sent success') )
      .catch(err => console.log(err) )
    }else{return null}})
    ;

}
);
exports.volunterJoined = functions.firestore
  .document('sites/{siteId}/volunteers/{volunteerId}')
  .onCreate(doc => {

    const volunteer = doc.data();
    const msgbody = {
      to: volunteer.email,
      from: 'auto-reply@vnsachvaxanh.com',
      templateId: 'd-950e4b7ffaaf4799bfa6ae4c1992436f',
      "dynamic_template_data":{
      text:"Cảm ơn "+volunteer.name+" đã tham gia sự kiện Việt Nam Sạch & Xanh",
        subject:  'Cám Ơn Bạn Đã Tham Gia Sự Kiện',}
  };
  return sendgridemail.send(msgbody)
                .then(() => console.log('volunteer sent success') )
                .catch(err => console.log(err) )});

// exports.userJoined = functions.auth.user()
//   .onCreate(user => {
    
//     return admin.firestore().collection('users')
//       .doc(user.uid).get().then(doc => {

//         const newUser = doc.data();
//         const notification = {
//           content: 'Joined the party',
//           user: `${newUser.firstName} ${newUser.lastName}`,
//           time: admin.firestore.FieldValue.serverTimestamp()
//         };

//         return createNotification(notification);

//       });
// });
