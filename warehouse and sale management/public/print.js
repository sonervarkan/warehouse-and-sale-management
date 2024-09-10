document.querySelector(".fa-print").addEventListener("click", function(event){
    const printContents=document.getElementById("toPrint").innerHTML;
    const originalContents=document.body.innerHTML;
    document.body.innerHTML=printContents;
    window.print();
    document.body.innerHTML=originalContents;
}) 