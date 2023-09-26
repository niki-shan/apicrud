let cl=console.log;

const postcard = document.getElementById("postcard")
const mainform = document.getElementById("mainform")
const contentcontrol = document.getElementById("content")
const titlecontrol = document.getElementById("title")
const editcontrol=document.getElementById("edit")
const deletecontrol=document.getElementById("delete")
const updatecontrol=document.getElementById("update")
const submit=document.getElementById("submit")

const baseurl = "http://localhost:3000"
// const posturl=  "http://localhost:3000/posts"
const posturl=`https://fir-24bc6-default-rtdb.asia-southeast1.firebasedatabase.app/`


const templating=(arr)=>{
    let result='';
    arr.forEach(ele => {
    result+= ` <div class="card mt-5" id=${ele.id}>
        <div class="card-header">
           <div class="h3">${ele.title}</div>
        </div>
        <div class="card-body">
           <p>${ele.content}</p>
        </div>
        <div class="card-footer">
        <button class="btn btn-primary" onclick="onedit(this)" id="edit">Edit</button>
        <button class="btn btn-danger" onclick="ondelete(this)" id="delete">Delete</button>
        </div>
        </div>
      `
    });
    postcard.innerHTML = result
}

const onedit=(ele)=>{
     let editid=ele.closest(".card").id;
     localStorage.setItem("editid",editid)
     let editurl =`${posturl}/${editid}`

    updatecontrol.classList.remove("d-none");
    submit.classList.add("d-none")
     
     makeApicall("GET",editurl)
     
  }

  const onUpdate=(ele)=>{
    let updateid = localStorage.getItem("editid")
    let updateurl = `${posturl}/${updateid}` 
    let updateobj={
        title : titlecontrol.value,
        content : contentcontrol.value
    }
      


    makeApicall("PATCH",updateurl,JSON.stringify(updateobj))

  }




 const ondelete=(ele)=>{
     let deleteid=ele.closest(".card").id;
     let deleturl=`${posturl}/${deleteid}`
     
     
     makeApicall("DELETE", deleturl)
      
Swal.fire({
    title: 'Do you want to save the changes?',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'Save',
    denyButtonText: `Don't save`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      Swal.fire('Saved!', '', 'success')
    } else if (result.isDenied) {
      Swal.fire('Changes are not saved', '', 'info')
    }
  })
 }


  




function makeApicall(methodname,apiUrl,body = null){
    let xhr=new XMLHttpRequest() //request send 
    xhr.responseType ='json'    // data type
    xhr.open( methodname, apiUrl, true)  
    xhr.setRequestHeader("Authorization","JWT-Token")
    xhr.setRequestHeader("content-type","application/json")
    xhr.send(body)
     
    xhr.onload = function(){
         if(xhr.status >= 200 && xhr.status < 300){
                 cl(xhr.response)
                 let data = xhr.response
             if(methodname=='GET' && Array.isArray(data)){
                templating(data)
                cl(data)
             }else if(methodname=='GET' && !Array.isArray(data)){
                 cl("single object")
                 titlecontrol.value=data.title;
                 contentcontrol.value=data.content
             }
         }else{
            cl("not response")
         }
         
    }
    // xhr.send(body)

}
makeApicall("GET", posturl)

const onAdd=(eve)=>{
    eve.preventDefault();
    cl("submitted")
    let obj = {
        title :titlecontrol.value,
        content :contentcontrol.value
    }
    cl(obj)
    makeApicall("POST",posturl,JSON.stringify(obj));  
}
// makeApicall("GET",posturl)






mainform.addEventListener("submit", onAdd);
updatecontrol.addEventListener("click",onUpdate)

