const debounce = (onInput,delay=1000) =>{
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
    clearTimeout(timeoutId)
  }
  timeoutId = setTimeout(() =>{
    onInput.apply(null,args);
  },delay)
}
}
