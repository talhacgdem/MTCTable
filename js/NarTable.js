class NarTable{
    
    headers;
    search;
    tbodyId;
    mainrequest;
    
    spanTotalId = "total-result"
    spanCurrentId = "current-result"
    paginationDivId = "pagination"
    
    constructor(config){
        this.mainrequest = config.main
        this.headers = config.indexes
        this.search = config.search 
        this.tbodyId = this.#uuid()
        
        this.#createTable(config.parent)
        this.#getMain()      
    }
    
    #getMain(){
        var self = this
        
        $.ajax({
            type: "get",
            url: self.mainrequest,
            success: function(result){
                self.#build(result)
            },
            error: function(err){
                console.log(err)
            }
        })
    }
    
    #createTable(parentId){
        var self = this
        
        var mainDiv = document.getElementById(parentId)
        mainDiv.style.padding = "2rem"
        
        
        var table = document.createElement("table");
        table.classList.add("table", "table-striped", "table-borderless", "text-center")
        var thead = document.createElement("thead")
        
        for (const [key, value] of Object.entries(self.headers.index)) {
            var th = document.createElement("th")
            th.innerText = self.headers.desc[key]
            th.id = value
            thead.appendChild(th)
        }
        
        
        var tbody = document.createElement("tbody")
        tbody.id = self.tbodyId
        
        table.appendChild(thead)
        table.appendChild(tbody)
        
        mainDiv.appendChild(self.#setSearchBar())
        mainDiv.appendChild(table)
        mainDiv.appendChild(self.#footer())
    }
    
    #footer(){
        let footer = document.createElement("div")
        footer.classList.add("d-flex", "justify-content-between", "p-1")
        footer.id = "table-footer"
        
        let spanTotal = document.createElement("span")
        spanTotal.id = this.spanTotalId
        
        let spanCurrent = document.createElement("span")
        spanCurrent.id = this.spanCurrentId
        
        let stats = document.createElement("div")
        stats.classList.add("stats")
        stats.appendChild(spanCurrent)
        stats.appendChild(spanTotal)
        
        let pagination = document.createElement("div")
        pagination.id = this.paginationDivId
        
        footer.appendChild(stats)
        footer.appendChild(pagination)
        
        return footer
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
            searchBox.setAttribute('id', item.key)
            searchBox.classList.add("form-control")
            
            searchBox.onkeyup = function(searchBox){
                self.#search(this, item.method, item.url, item.key)
            }
            
            searchBoxDiv.appendChild(searchBox)
            searchDiv.appendChild(searchBoxDiv)
        })
        
        
        return searchDiv
    }
    
    
    
    #search(element, method, url, key){
        var self = this
        
        let text = new Text(element.value)
        if(text.length >= 2){
            let arr = {[key]: element.value}
            $.ajax({
                type: method,
                url: url, 
                data: arr,
                success: function(result){
                    self.#build(result)
                },
                error: function(err){
                    console.log(err)
                }
            })
        }
    }
    
    
    #clear(){
        let tbody = document.getElementById(this.tbodyId)
        while (tbody.firstChild) {
            tbody.removeChild(tbody.lastChild);
        }
    }
    
    #build(data){
        this.#clear()
        let self = this
        let page = data.page
        let users = data.users
        
        self.#setFooter(page)
        
        let tbody = document.getElementById(this.tbodyId)
        
        users.forEach(function(item, index){
            tbody.appendChild(self.#createTr(item))            
        })
    }
    
    #setFooter(config){
        let self = this
        
        let page = config.page
        let pageCount = config.pagesize
        let resultSize = config.resultsize
        let total = config.total
        
        document.getElementById(self.spanTotalId).innerText = "Toplam kayıt : " + total
        document.getElementById(self.spanCurrentId).innerText = "Listelenen kayıt : " + resultSize
        
        
        self.#setPagination(page, pageCount)
        
        
        
    }
    
    
    #setPagination(page, pageCount){
        console.log(page, pageCount)
        
        let ul = document.createElement("ul")
        ul.classList.add("pagination")
        
        for(let i = 1; i <= pageCount; i++){
            let li = document.createElement("li")
            li.classList.add("page-item")
            if(i == page){
                li.classList.add("active")
            }
            
            let a = document.createElement("a")
            a.classList.add("page-link")
            a.setAttribute("href", "#")
            a.innerText = i
            
            li.appendChild(a)
            
            ul.appendChild(li)
        }
        document.getElementById(this.paginationDivId).innerHTML = ""
        document.getElementById(this.paginationDivId).appendChild(ul)
        
    }
    
    #createTr(row){
        let self = this
        let mainTR = document.createElement("tr")
        
        self.headers.index.forEach(function(item, index){
            
            
            let tdObj = document.createElement("td")
            tdObj.innerText = row[item]
            mainTR.appendChild(tdObj)
        })
        
        return mainTR
    }
    
    
    #uuid() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
    
    
    
    
    
}
