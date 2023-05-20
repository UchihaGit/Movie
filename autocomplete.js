const createAutoComplete = ({root, renderOption, onOptionSelect, inputValue, fetchData}) =>{

  root.innerHTML = `
    <label><b>Search</b></label>
    <input type="text" class="input" id="input">
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content results">
        </div>
      </div>
    </div>
  `
  const input = root.querySelector("#input");
  const results = root.querySelector(".results");
  const dropdown = root.querySelector(".dropdown");

  const onInput = async event =>{
      const items = await fetchData(event.target.value);
      if(!items.length){                                                           //check if the input is empty
        dropdown.classList.remove("is-active");                                     //removes empty widget
        return;
      }
      results.innerHTML = '';
      dropdown.classList.add("is-active");

      for (let item of items) {
        const option = document.createElement("a");
        option.classList.add("dropdown-item");
        option.innerHTML = renderOption(item);
        option.addEventListener('click', async function() {                                //on option select display correct movie Title
          dropdown.classList.remove("is-active");                                   //and remove empty widget
          input.value = inputValue(item);
          onOptionSelect(item);
        })
        results.appendChild(option);
      }
  }
  input.addEventListener("input", debounce(onInput,500));
  document.addEventListener('click', function(e) {
    if(!root.contains(e.target)){
      dropdown.classList.remove("is-active");
    }
  });
}
