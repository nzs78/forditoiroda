document.getElementById("szoveg").addEventListener("keyup", function(){
    
    document.getElementById("karakter").value=this.value.replaceAll(' ','').length;
})