 // Lfu cache main algo
 class node {

    constructor(key, value) {
        this.next = null;
        this.prev = null;
        this.key = key;
        this.value = value;
        this.freqno = 0;
    }
};

class lnklist {


    constructor() {
        this.head = new node(-1, -1);
        this.tail = new node(-1, -1);
        this.head.next = this.tail;
        this.tail.prev = this.head;
        this.len = 0;
    }

    addNodeAtStart(newNode) {
        var temp = this.head.next;
        newNode.next = temp;
        temp.prev = newNode;
        this.head.next = newNode;
        newNode.prev = this.head;
        this.len++;
    }

    deleteNode(nodeAdrs) {
        var temp1 = nodeAdrs.prev;
        var temp2 = nodeAdrs.next;
        temp1.next = temp2;
        temp2.prev = temp1;
        this.len--;
    }

};

class LFUCache {


    constructor(capacity) {
        this.printDirection(`Updated Capacity of Cache Memory is ${capacity}`);
        this.capacity = capacity;
        this.minfreq = 0;
        this.freq = new Map();
        this.m = new Map();
    }

    printHashmap() {
        document.querySelector("#hashmap").innerHTML = "";
        for (let [key, adrs] of this.m) {
            document.querySelector("#hashmap").innerHTML += `<div class="hashmap_element"> <h2 class="key_hashmap">${key}</h2> <div class="arrow"> </div>> <h2 class="value_hashmap"> ${adrs.value}</h2></div>`;
        }
    }

    printLinklist() {
        console.log(this.freq);
        document.querySelector("#linklist").innerHTML = "";

        for (let [freqno, lnkadrs] of this.freq) {
            var temp = lnkadrs.head;
            var id = "lnklst" + freqno;
            document.querySelector("#linklist").innerHTML += ` <div id="${id}" class="lnklist_element"> <div class="freqno"><h2>${freqno}</h2></div></div>`;

            if (lnkadrs.len == 0) {
                document.querySelector(`#${id}`).innerHTML += `<div class="arrow"></div>> <div class="lstNode"><h2>NULL</h2></div>`;

            }
            else {
                for (var i = 0; i < lnkadrs.len; i++) {
                    temp = temp.next;
                    document.querySelector(`#${id}`).innerHTML += `<div class="arrow"></div>> <div class="lstNode"><h2>${temp.key} : ${temp.value}</h2></div>`;
                }
            }


        }
    }

    printDirection(toPrint) {
        const toast = document.querySelector(".toast")
        closeIcon = document.querySelector(".close"),
            progress = document.querySelector(".progress");


        let timer1, timer2;
        document.querySelector("#direction_msg").innerText = `${toPrint}`;

        toast.classList.add("active");
        progress.classList.add("active");

        timer1 = setTimeout(() => {
            toast.classList.remove("active");
        }, 5000); //1s = 1000 milliseconds

        timer2 = setTimeout(() => {
            progress.classList.remove("active");
        }, 5300);

    }


    updateFreqCount(nodeAdrs) {
        var lnklstadrs = this.freq.get(nodeAdrs.freqno);
        lnklstadrs.deleteNode(nodeAdrs);
        // this.freq.get(nodeAdrs.freqno).deleteNode(nodeAdrs);

        if (this.freq.get(nodeAdrs.freqno).len == 0 && this.minfreq == nodeAdrs.freqno) {
            this.minfreq++;
        }

        var newlnk = new lnklist();

        if (this.freq.has(nodeAdrs.freqno + 1)) {
            newlnk = this.freq.get(nodeAdrs.freqno + 1);
        }

        nodeAdrs.freqno++;
        this.freq.set(nodeAdrs.freqno, newlnk);
        newlnk.addNodeAtStart(nodeAdrs);
    }



    get(key) {
        if (this.m.has(key)) {
            var value = this.m.get(key).value;
            var freqno = this.m.get(key).freqno;
            this.updateFreqCount(this.m.get(key));
            this.printHashmap();
            this.printLinklist();
            this.printDirection(`The key ${key} is present whoose value is ${value} and Frequency Count is ${freqno}`)
            return value;
        }
        this.printHashmap();
        this.printLinklist();
        this.printDirection(`The key ${key} is not present`);
        return -1;
    }


    put(key, value) {

        if (this.m.has(key)) {
            this.m.get(key).value = value;
            var lstadrs = this.freq.get(this.m.get(key).freqno);
            this.updateFreqCount(this.m.get(key));
            this.printHashmap();
            this.printLinklist();
            this.printDirection(`The value at corresponding key ${key} is updated with ${value} and Frequency count is updated!! `)

        }
        else {
            if (this.capacity > 0) {
                var newlnk = new lnklist();
                var newNode = new node(key, value);
                if (this.freq.has(1)) {
                    newlnk = this.freq.get(1);
                }
                newNode.freqno = 1;
                this.freq.set(1, newlnk);
                newlnk.addNodeAtStart(newNode);
                this.capacity--;
                this.m.set(key, newNode);
                this.minfreq = 1;
                this.printHashmap();
                this.printLinklist();
                this.printDirection(`New key value pair is added and Frequency count is updated with one!!`);

            }
            else {
                var nodeAdrs = this.freq.get(this.minfreq).tail.prev;
                this.m.delete(nodeAdrs.key);
                this.freq.get(this.minfreq).deleteNode(nodeAdrs);

                var newNode = new node(key, value);
                var newlnk = new lnklist();
                if (this.freq.has(1)) {
                    newlnk = this.freq.get(1);
                }
                this.m.set(key, newNode);
                newNode.freqno = 1;
                this.freq.set(1, newlnk);
                newlnk.addNodeAtStart(newNode);
                this.minfreq = 1;
                this.printHashmap();
                this.printLinklist();
                this.printDirection(`The key ${key} is not present and capacity is full. Least Frequently used ${nodeAdrs.key} ${nodeAdrs.value} pair is deleted!!`);

            }
        }

    }
};


// showing the range value       
var elem = document.querySelector('input[type="range"]');

var rangeValue = function () {
    var newValue = elem.value;
    var target = document.querySelector('.value');
    target.innerHTML = newValue;
}

elem.addEventListener("input", rangeValue);


// getting the value of the range
var set_range_btn = document.querySelector('#set_range');
var value_range = 0;
var obj;

set_range_btn.addEventListener("click", () => {
    value_range = elem.value;
    document.querySelector("#hashmap").innerHTML = "";
    document.querySelector("#linklist").innerHTML = "";
    obj = new LFUCache(value_range);
    console.log(value_range);
});

// getting input from user for key value(put)
var key_input = document.querySelector("#key_input");
var value_input = document.querySelector("#value_input");
var put_btn = document.querySelector("#put_btn");
var key = 0;
var value = 0;

put_btn.addEventListener("click", () => {
    key = key_input.value;
    value = value_input.value;
    if (key !== '' && value !== '') {
        key_input.value = "";
        value_input.value = "";
        key = parseInt(key)
        value = parseInt(value);
        obj.put(key, value);
        console.log(key, value);
    }
    else {
        alert("Please add a valid key value pair!!")
    }
});

// getting input from user of the key (get)
var find_key_input = document.querySelector("#find_key_input");
var put_btn = document.querySelector("#put_btn");
var getkey = 0;

get_btn.addEventListener("click", () => {
    getkey = find_key_input.value;
    find_key_input.value = "";
    if (getkey !== '') {
        getkey = parseInt(getkey);
        obj.get(getkey);
        console.log(getkey);
    }
    else {
        alert("Please add a valid key!!")
    }
});
