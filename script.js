function calculate(){

let total=0

total+=Number(document.getElementById("q1").value)

total+=Number(document.getElementById("q2").value)

total+=Number(document.getElementById("q3").value)


let result=document.getElementById("result")


if(total<=4){

result.innerHTML=

"🟢 Smart AI User"

}

else if(total<=7){

result.innerHTML=

"🟡 Balanced User"

}

else{

result.innerHTML=

"🔴 AI Dependent User"

}

}