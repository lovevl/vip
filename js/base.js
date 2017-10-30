function preventDefault() {
    var event = event?event:window.event;
    if(event.preventDefault){
        event.preventDefault();
    }else{
        event.returnValue = false;
    }
}