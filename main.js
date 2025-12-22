window.addEventListener("click", event => {
  console.log(event.target)
})

//Loading Screen
const loadingTag = document.querySelector(".loading")

window.addEventListener("load" , () => {setTimeout(() => {
    loadingTag.style.opacity = 0;
    startUsage()
}, 2500)})

window.addEventListener("load" , () => {setTimeout(() => {
    loadingTag.style.display = "none";
}, 3000)})

//Usage and Chart
const cpuBar = document.querySelector("#CPU-internal-bar")
const memoryBar = document.querySelector("#memory-internal-bar")
const diskBar = document.querySelector("#disk-internal-bar")
let dataArray = [];
var CPU = {
    tag: document.querySelector("#CPU-internal-bar"),
    array: [0, 0, 0, 0, 0],
}

var memory = {
    tag: document.querySelector("#memory-internal-bar"),
    array: [0, 0, 0, 0, 0],
}

var disk = {
    tag: document.querySelector("#disk-internal-bar"),
    array: [0, 0, 0, 0, 0],
}

//chart
var options = {
  chart: {
    type: 'line'
  },
  series: [{
    name: 'CPU',
    data: CPU.array,
  }, {
    name: 'Memory',
    data: memory.array,
  }, {
    name: 'Disk',
    data: disk.array,
  }],
  xaxis: {
    categories: [0, 2, 4, 8, 10]
  },
  // stroke: {
  //   curve: 'smooth'
  // }
}

var chart = new ApexCharts(document.querySelector(".chart-block"), options);

chart.render();


function startUsage() {
    setInterval(() => {
        setPercentage(CPU)
        setPercentage(memory)
        setPercentage(disk)
    }, 2000)
}

function setPercentage(obj) {
    const type = obj.tag.getAttribute("hardwareType");
    const span = document.querySelector(`span[hardwareType="${type}"]`)
    const value = Math.floor(Math.random() * (101 - 10)) + 10
    obj.tag.style.width = `${value}%`
    span.innerHTML = `${value}%`
    obj.array.pop()
    obj.array.unshift(value)

    switch(obj) {
      case CPU:
        chart.updateSeries([{
          name: options.series[0].name,
          data: obj.array,
        }, {
          name: options.series[1].name,
          data: options.series[1].data,
        }, {
          name: options.series[2].name,
          data: options.series[2].data,
        }], false)
        break
      case memory:
        chart.updateSeries([{
          name: options.series[0].name,
          data: options.series[0].data,
        }, {
          name: options.series[1].name,
          data: obj.array,
        }, {
          name: options.series[2].name,
          data: options.series[2].data,
        }], false)
        break
      case disk:
        chart.updateSeries([{
          name: options.series[0].name,
          data: options.series[0].data,
        }, {
          name: options.series[1].name,
          data: options.series[1].data,
        }, {
          name: options.series[2].name,
          data: obj.array,
        }], false)
        break
    }
    
}

//Home
const addFileButton = document.querySelector("#addFileButton")
const addFolderButton = document.querySelector("#addFolderButton")
const deleteButton = document.querySelector("#deleteButton")
const deleteFolderButton = document.querySelector("#deleteFolderButton")
const currentPage = document.querySelector("#currentPage")
let dataBox = document.querySelector(".data-box")
const overlay = document.querySelector(".overlay")
const message = document.querySelector(".message")
const closeMessageButton = document.querySelector("#closeMessageButton")
let valueInput = document.querySelector("#valueInput")
const enterButton = document.querySelector("#enterButton")
let files = []
let folders = []
let names = []
let current = null
const logData = document.querySelector("#logData")
let treeItems = []
const tree = document.querySelector(".tree")
const previewOverlay = document.querySelector("#previewOverlay")
const preview = document.querySelector(".preview");
const closePreviewButton = document.querySelector("#closePreviewButton")
const previewInput = document.querySelector("#previewInput")
const saveButton = document.querySelector("#saveButton")
let currentPreviewTag = null

function appearMessage(event) {
  overlay.style.display = "initial"
  message.style.display = "flex"
  current = event.target.getAttribute("button-type")
}

enterButton.addEventListener("click", () => {
  if(valueInput.value != "" && current == "addFile") {
    createFile(valueInput.value)
  } else if(valueInput.value != "" && current == "addFolder") {
    createFolder(valueInput.value)
  } else if(valueInput.value != "" && current == "delete") {
    deletef(valueInput.value)
  } else if(valueInput.value != "" && current == "deleteFolder") {
    deleteFolder(valueInput.value)
  }
  hiddenMessage()
  valueInput.value = ""
  current = null
})

function hiddenMessage() {
  overlay.style.display = "none"
  message.style.display = "none"
  valueInput.value = ""
}

closeMessageButton.addEventListener("click", () => hiddenMessage())
document.querySelector(".overlay").addEventListener("click", () => hiddenMessage())


function createFile(name) {
  if(names.indexOf(name + ".txt") == -1) {
    name += ".txt"
    var obj = {
      current: currentPage.innerHTML,
      name: name,
      content: "",
    }
    files.push(obj)
    names.push(obj.name)
    const fileButton = document.createElement("button")
    fileButton.classList.add("file")
    fileButton.setAttribute("name", name)
    fileButton.setAttribute("content", "")
    fileButton.innerHTML = `<i class="bi bi-file-earmark"></i><p>${obj.name}</p>`
    fileButton.addEventListener("click", (event) => appearPreview(event))
    dataBox.append(fileButton)
    const date = new Date()
    logData.innerHTML += `<p style="background-color: #07ff0087">${name} Created Successfully ${date.toString()}</p>`
    // tree.innerHTML += `<p name="${name}-tree">${name}</p>`
  } else {
    const date = new Date()
    logData.innerHTML += `<p style="background-color: #ff000087">The file already exist!!! ${date.toString()}</p>`
  }
  
}

function createFolder(name) {
  if(names.indexOf(name) == -1) {
    var objF = {
      current: currentPage.innerHTML,
      name: name,
      content: [],
    }
    folders.push(objF)
    names.push(objF.name)
    const folderButton = document.createElement("button")
    folderButton.classList.add("folder")
    folderButton.setAttribute("name", objF.name)
    folderButton.setAttribute("content", objF.content)
    folderButton.innerHTML = `<i class="bi bi-folder-fill"></i><p>${objF.name}</p>`
    folderButton.addEventListener("click", () => null)
    dataBox.append(folderButton)
    const date = new Date()
    logData.innerHTML += `<p style="background-color: #07ff0087">${name} Created Successfully ${date.toString()}</p>`
    // tree.innerHTML += `<p name="${name}-tree">${name}</p>`
  } else {
    const date = new Date()
    logData.innerHTML += `<p style="background-color: #ff000087">The folder already exist!!! ${date.toString()}</p>`
  }
  
}

function deletef(name) {
  name += ".txt"
  if(names.indexOf(name) != -1) {
    names[names.indexOf(name)] = ""
    files[files.indexOf(name)] = ""
    document.querySelector(`[name="${name}"]`).remove()
    const date = new Date()
    logData.innerHTML += `<p style="background-color: #07ff0087">${name} Deleted Successfully ${date.toString()}</p>`
    // tree.innerHTML += `<p name="${name}-tree">${name}</p>`
  } else {
    const date = new Date()
    logData.innerHTML += `<p style="background-color: #ff000087">Not Exist!!! ${date.toString()}</p>`
  }
}

function deleteFolder(name) {
  if(names.indexOf(name) != -1) {
    names[names.indexOf(name)] = ""
    folders[folders.indexOf(name)] = ""
    document.querySelector(`[name="${name}"]`).remove()
    const date = new Date()
    logData.innerHTML += `<p style="background-color: #07ff0087">${name} Created Successfully ${date.toString()}</p>`
  } else {
    const date = new Date()
    logData.innerHTML += `<p style="background-color: #ff000087">Not Exist!!! ${date.toString()}</p>`
  }
}

addFileButton.addEventListener("click", (event) => appearMessage(event))
addFolderButton.addEventListener("click", (event) => appearMessage(event))
deleteButton.addEventListener("click", (event) => appearMessage(event))
deleteFolderButton.addEventListener("click", (event) => appearMessage(event))
console.log(files);

function appearPreview(event) {
  console.log("text");
  
  previewOverlay.style.display = "initial"
  preview.style.display = "flex"
  currentPreviewTag = event.target
  previewInput.value = currentPreviewTag.getAttribute("content")
}

function hiddenPreview() {
  previewOverlay.style.display = "none"
  preview.style.display = "none"
}

function savePreviewValue() {
  let value = previewInput.value
  currentPreviewTag.setAttribute("content", value)
  hiddenPreview()
}

closePreviewButton.addEventListener("click", () => hiddenPreview())
previewOverlay.addEventListener("click", () => hiddenPreview())
saveButton.addEventListener("click", () => savePreviewValue())


