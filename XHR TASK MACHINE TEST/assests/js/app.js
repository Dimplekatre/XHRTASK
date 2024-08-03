const cl= console.log;
const cardcontainer= document.getElementById("cardcontainer");
const loader= document.getElementById("loader");
const postform= document.getElementById("postform");
const titlecontrol=document.getElementById("titleId");
const contentcontrol=document.getElementById("contentId");
const useridcontrol=document.getElementById("userId");
const submitbtn= document.getElementById("submitbtn");
const updatebtn= document.getElementById("updatebtn");

let BASE_URL= 'https://jsonplaceholder.typicode.com'

let POST_URL= `${BASE_URL}/posts`;

const sweetalert=(msg,icon)=>{
       Swal.fire({
          title:msg,
          timer:2500,
          icon:icon
       })
}


let postArr=[];
const templating=(arr)=>{
       let result=``;
       
       arr.forEach(post => {
            result+=`
             <div class="col-md-4 mb-4 ">
                <div class="card postcard h-100" id=${post.id}>
                    <div class="card-header">
                         <h3 class="m-0">${post.title}</h3>
                    </div>
                    <div class="card-body">
                         <p class="m-0">${post.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                      <button onclick="onEdit(this)" class="btn btn-sm btn-outline-primary">EDIT</button>
                      <button onclick="onDelete(this)" class="btn btn-sm btn-outline-danger">DELETE</button>
                    </div>
                </div>
            </div>
            `
            cardcontainer.innerHTML=result;
       });
}



const fetchpost=()=>{
     loader.classList.remove('d-none')
       let xhr= new XMLHttpRequest();

       xhr.open("GET",POST_URL);

       xhr.send();

       xhr.onload=function(){
           if(xhr.status>=200 && xhr.status<300){
               postArr=JSON.parse(xhr.response)
                 templating(postArr);
           }
          loader.classList.add('d-none');
          sweetalert("POST IS FETCHED SUCCESSFULLYY!!!","success")
       }
}
fetchpost();

const onpostadd=(eve)=>{
      eve.preventDefault();
    let newpost={
         title:titlecontrol.value,
         body:contentcontrol.value,
         userId:useridcontrol.value
    }

    loader.classList.remove("d-none");

    let xhr= new XMLHttpRequest();

    xhr.open("POST",POST_URL);

    xhr.send(JSON.stringify(newpost));

    xhr.onload=function(){
         if(xhr.status>=200 && xhr.status<300){
              newpost.id= JSON.parse(xhr.response).id
              let div= document.createElement('div');
              div.className="col-md-4 mb-4 ";
              div.innerHTML=`
                   <div class="card postcard h-100" id=${newpost.id}>
                    <div class="card-header">
                         <h3 class="m-0">${newpost.title}</h3>
                    </div>
                    <div class="card-body">
                         <p class="m-0">${newpost.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                      <button onclick="onEdit(this)" class="btn btn-sm btn-outline-primary">EDIT</button>
                      <button onclick="onDelete(this)" class="btn btn-sm btn-outline-danger">DELETE</button>
                    </div>
                </div>
            </div>
              
              `
              cardcontainer.prepend(div);
              postform.reset();
         }
         loader.classList.add('d-none');
         sweetalert("NEW POST IS CREATED SUCCESSFULLYY!!","success")
    }
}

const onEdit=(ele)=>{
    let editId= ele.closest(".card").id;
    localStorage.setItem("editId", editId);

    let EDIT_URL= `${BASE_URL}/posts/${editId}`;
     
    loader.classList.remove("d-none");

    let xhr= new XMLHttpRequest();

    xhr.open("GET",EDIT_URL);

    xhr.send();

    xhr.onload=function(){
         if(xhr.status>=200 && xhr.status<300){
            cl(xhr.response);
            let post= JSON.parse(xhr.response);
            titlecontrol.value=post.title;
            contentcontrol.value=post.body;
            useridcontrol.value=post.userId;
            submitbtn.classList.add('d-none');
            updatebtn.classList.remove('d-none');
            window.scrollTo({top:0,behavior:"smooth"});
         }
         loader.classList.add("d-none");
    }

}



const onpostupdate=()=>{
      let updatedobj= {
          title:titlecontrol.value,
          body:contentcontrol.value,
          userId:useridcontrol.value
      }
      cl(updatedobj);
      let updateId= localStorage.getItem('editId');

      let UPDATE_URL= `${BASE_URL}/posts/${updateId}`;

      loader.classList.remove("d-none");
      let xhr= new XMLHttpRequest();

      xhr.open("PATCH",UPDATE_URL);

      xhr.send(JSON.stringify(updatedobj));

      xhr.onload=function(){
          if(xhr.status>=200 && xhr.status<300){
               let card= [...document.getElementById(updateId).children];
               
               card[0].innerHTML=`<h3 class="m-0">${updatedobj.title}</h3>`;
               card[1].innerHTML=`<p class="m-0">${updatedobj.body}</p>`;
               postform.reset();
               submitbtn.classList.remove('d-none');
               updatebtn.classList.add('d-none');
               loader.classList.add('d-none');
              }
             
              sweetalert("POST IS UPDATED SUCCESSFULLYY!!!","success")
      }


}
const onDelete=(ele)=>{
    let removeId= ele.closest('.card').id;
    let REMOVE_URL=`${BASE_URL}/posts/${removeId}`;

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
          loader.classList.remove('d-none');

          let xhr= new XMLHttpRequest();
    
          xhr.open("DELETE",REMOVE_URL);
    
          xhr.send();
    
          xhr.onload=function(){
               if(xhr.status>=200 && xhr.status<300){
                    ele.closest('.card').parentElement.remove();
               }
               loader.classList.add("d-none");
          }
          sweetalert("POST IS REMOVED SUCCESSFULLY!!!","success")
      }
    });


    
}

postform.addEventListener("submit",onpostadd);
updatebtn.addEventListener("click",onpostupdate);