var db =firebase.firestore();

// Add a new document in collection "cities"
function storeData(){
    var Textfield=document.getElementById('text_fld').value;
    var TextDay=document.getElementById('text_day').value;
    var period_No=document.getElementById('periodno').value;
    var sub=document.getElementById('Subject').value;
    var typ=document.getElementById('type').value;
    var groupno=document.getElementById('grp').value;
    var loc=document.getElementById('location').value;
    var teach=document.getElementById('Teacher').value;
    

db.collection("routines").doc(Textfield).collection(TextDay).doc(period_No).set({

    subject: sub,
    type: typ,
    group: groupno,
    location:loc,
    teacher: teach
})
.then(function() {
    console.log("Document successfully written!");
    return;
})
.catch(function(error) {
    console.error("Error writing document: ", error);
});

   
}