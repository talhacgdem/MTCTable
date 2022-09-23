class NarTable{

    headers;
    search;
    tbodyId;

    constructor(arr, parentId, search){
        this.headers = arr
        this.search = search 
        this.tbodyId = this.#uuid()

        this.#createTable(parentId)       
    }

    #createTable(parentId){
        var self = this

        var mainDiv = document.getElementById(parentId)
        mainDiv.style.padding = "2rem"
        
        
        var table = document.createElement("table");
        table.classList.add("table", "table-striped", "table-borderless", "text-center")
        var thead = document.createElement("thead")

        self.headers.forEach(function(item){
            var th = document.createElement("th")
            th.innerText = item
            thead.appendChild(th)
        });
        

        var tbody = document.createElement("tbody")
        tbody.id = self.tbodyId

        mainDiv.appendChild(self.#setSearchBar())
        table.appendChild(thead)
        table.appendChild(tbody)
        mainDiv.appendChild(table)
    }

    #setSearchBar(){
        var self = this
        let searchArr = self.search

        let searchDiv = document.createElement("div")
        searchDiv.classList.add("row", "d-flex", "justify-content-center", "mb-3")

        searchArr.forEach(function(item, index){
            let searchBoxDiv = document.createElement("div")
            searchBoxDiv.classList.add("col-4")

            let searchBox = document.createElement("input")
            searchBox.setAttribute("type", "text")
            searchBox.setAttribute("placeholder", item.desc)
            searchBox.classList.add("form-control")

            searchBox.onkeyup = function(searchBox){
                self.#search(this, item.method, item.url, item.key)
            }

            //searchBox.onchange(self.#search(searchBox, item.method, item.url, item.key))


            /*
            searchBox.setAttribute("onchange", 
                self.#search(searchBox, item.method, item.url, item.key)
            );
            */

            searchBoxDiv.appendChild(searchBox)
            searchDiv.appendChild(searchBoxDiv)
        })


        return searchDiv
    }



    #search(element, method, url, key){
        var self = this
        let fd = new FormData
        
        if(this.#checkValueSize(element)){
            fd.append(key, element.value)
            console.log(fd)
            $.ajax({
                type: method,
                url: url,
                data: fd,
                dataType: dataType
              }).done(function(data) {
                self.#build(data)
              });
        }
        
    }

    #checkValueSize(element){
        console.log(element.value)
        if(element.value.lenght > 5){
            return true
        }else{
            return false
        }
    }


    #build(data){
        
    }


    #uuid() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }





}
