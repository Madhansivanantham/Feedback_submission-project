// --global declaration
const MAX_CHARS=150;
const API_URL ='https://bytegrad.com/course-assets/js/1/api';
const textAreaEl=document.querySelector('.form__textarea');
const text=textAreaEl.value;
const formEl=document.querySelector('.form');
const newlistItem=document.querySelector('.feedbacks');
const submitBtn=document.querySelector('.submit-btn');
const counterValue=document.querySelector('.counter');
const spinnerElem=document.querySelector('.spinner');
const hashtagItems=document.querySelector('.hashtags');

// function for creating new feedback list items
// in this function we have to form an object to fetch the required data like company details etc
const createnewlistItem =function(newItems){
    const newfeedbackItem=`
    <li class="feedback">
      <button class="upvote">
      <i class="fa-solid fa-caret-up upvote__icon"></i>
      <span class="upvote__count">${newItems.upvoteCount}</span>
      </button>
      <section class="feedback__badge">
      <p class="feedback__letter">${newItems.badgeLetter}</p>
      </section>
      <div class="feedback__content">
      <p class="feedback__company">${newItems.company}</p>
      <p class="feedback__text">${newItems.text}</p>
      </div>
      <p class="feedback__date">${newItems.daysAgo===0 ? 'NEW' : `${newItems.daysAgo}d`}</p>

    </li>`;

    newlistItem.insertAdjacentHTML('beforeend',newfeedbackItem);
}


//-- counter component
// here this component represent the string left value where the user can access the limit info
const inputEvent=()=>{
    const maxCharString=MAX_CHARS;
    const typedString=textAreaEl.value.length;
    const stringLeft=maxCharString-typedString;
    counterValue.textContent=stringLeft;
    // console.log(stringLeft);

}
textAreaEl.addEventListener('input',inputEvent);


// --form component
//here initially we have to check the textarea content weather it passes the limit and expected criteria
// then we have to add the class weather it is valid or invalid

 const  submitCheck=(testcheck)=>{
    const className=testcheck==='valid'? 'form--valid' : 'form--invalid';
    formEl.classList.add(className);
    setTimeout(()=>{
        formEl.classList.remove(className);
    },2000)
}

const submitHandler=(event)=>{
    event.preventDefault();
    const text=textAreaEl.value;
    // console.log(text);
    if(text.includes('#')&&text.length >5){
        // console.log('working')
        submitCheck('valid');
     
    }
    else{
        submitCheck('invalid')
        textAreaEl.focus();
        return;
    }
//    in this section we have variables which store the typed values in the textarea i.e in that text feild
    const hashtag =text.split(' ').find(word => word.includes('#'));
    const companyName=hashtag.substring(1);
    const badgeletter=companyName.substring(0,1).toUpperCase();
    console.log(companyName);
    const upvoteCount=0;
    const daysAgo=0;
     
    // new feedback item
    const newitems={
        company:companyName,
        badgeLetter:badgeletter,
        // new way to represent same key ,value
        daysAgo,
        text,
        upvoteCount
    };
    createnewlistItem(newitems);

    // post request

    // here for post request we have to select an api_url which is the server.
    // we can store that data through our post request
    // usually we have to tell the request type and convert the objects into json()
    // then headers which used to describe what the type of data send and stored
    fetch(`${API_URL}/feedbacks`,{
        method:'POST',
        body: JSON.stringify(newitems),
        headers:{
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
    }).then(response => {
        if (!response.ok){
            console.log('something went wrong');
            return;
        }
    }).catch(error => {
        console.log(error);
    });


    // reset item value
    textAreaEl.value='';
    submitBtn.blur();
    counterValue.innerHTML=MAX_CHARS;

};

formEl.addEventListener('submit',submitHandler);

// fetch and rendering each list item
// here we have to fetch the data from a server at this api_url,
// as the result we have a json file so we have to convert it into js object
// so that we use json() method

const clickHandler=(event)=>{
  const clickElem=event.target;
//   console.log(clickElem);
  if(clickElem.className.includes('upvote')){
    // old one
     const upvoteBtn=clickElem.closest('.upvote');
     upvoteBtn.disabled='true';
     const upvoteCountEl=upvoteBtn.querySelector('.upvote__count');
     let upvoteCount=+upvoteCountEl.textContent;
     upvoteCountEl.textContent=++upvoteCount;
  }
  else{
    // console.log('expand the text content');
    // whenever user clicks the feedback list item it toggles the expand class
    clickElem.closest('.feedback').classList.add('feedback--expand');
    setTimeout(()=>{
        clickElem.closest('.feedback').classList.remove('feedback--expand')

    },6000)
  }

};
newlistItem.addEventListener('click',clickHandler)


// in this component we have fetch call to the server and gets the result as jason file then 
// we have to convert it into objects
    fetch(`${API_URL}/feedbacks`).then((response)=>{
        return response.json();
    }).then((data)=>{
    
        // remove spinner effect
        spinnerElem.remove();
        data.feedbacks.forEach((newItem)=>{
            // console.log(newItem);
    
            createnewlistItem(newItem);
        })
        }).catch(error =>{
            const errorText=`Hey Madhan ,it's just an error ${error}`;
            newlistItem.textContent= errorText;
        });
    
    console.log('testing....');




//-- hashtags components--
(()=>{
    const clickHandler=(event)=>{
        // company name from the hashtags list item
        const clickedhashtagItem=event.target;
        if(clickedhashtagItem.className.includes('hashtags')){
            return;
        }
        const cmpnamefromHashtag=clickedhashtagItem.textContent.substring(1).trim().toLowerCase();
        console.log(cmpnamefromHashtag);
    
        // company name from the feedback list item
       newlistItem.childNodes.forEach((childnode)=>{
        if(childnode.nodeType===3){
            return;
        }
        const cmpnamefromfeedback=childnode.querySelector('.feedback__company').textContent.toLowerCase().trim();
        if(cmpnamefromHashtag!==cmpnamefromfeedback){
            childnode.remove();
        }
       })
    
    
    }
    
    hashtagItems.addEventListener('click',clickHandler)

})();










