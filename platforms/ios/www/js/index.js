var app = {
    localNote: null,
    init: function () {
        try {
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        } catch (e) {
            document.addEventListener('DOMContentLoaded', this.onDeviceReady.bind(this), false);
            console.log('failed to find deviceready');
        }
    },
    onDeviceReady: function () {
        //set up event listeners and default variable values
        window.addEventListener('push', app.pageChanged);
        //cordova.plugins.notification.local
        app.localNote = cordova.plugins.notification.local;
        app.localNote.on("click", function (notification) {
            console.log('Cool a notification came up and you clicked on it');
            console.log('Clicked notice was:', notification.title);
            app.showList();
        });
        //show the list when loading
        app.showList();
    },
    pageChanged: function () {
        //user has clicked a link in the tab menu and new page loaded
        //check to see which page and then call the appropriate function

        if (document.querySelector('#page-notify')) {
            //if home page
            console.log('showing home page');
            //get list of notifications if on list page then display them
            app.showList();
        } else {
            //if add new page
            //add listener to button for saving new local notification
            let btn = document.querySelector('#btnAdd');
            btn.addEventListener('click', app.saveNew);

            let tempTime = new Date();
            tempTime.setMinutes(tempTime.getMinutes() + 2);
            console.log(tempTime.getDate(), tempTime.getMonth());

            let tim = document.querySelector('#time');
            tim.value = tempTime.toString();
        }
    },
    showList: function () {
        let list = document.querySelector('#list-notify');
        app.localNote.getAllIds(function (ids) {
            ids.forEach(function (id) {
                console.log('get details for id', id);
                app.localNote.get(id, function (notification) {
                    //now you can access the individual properties like notification.text
                    //build a list item for each notification
                    //add a listener to be able to delete the notification
                    /**
                    <li class="table-view-cell media">
                          <span class="media-object pull-left icon icon-trash"></span>
                          <div class="media-body">
                            Notification Time
                            <span class="badge">1</span>
                          </div>
                    </li>
                    **/
                    console.dir(notification);
                    let li = document.createElement('li');
                    //let a = document.createElement('a');
                    let span = document.createElement('span');
                    let div = document.createElement('div');
                    let badge = document.createElement('span');
                    li.className = "table-view-cell media";
                    //a.className = 'navigate-right';
                    span.className = 'media-object pull-left icon icon-trash';
                    div.className = 'media-body';
                    badge.className = 'badge pull-right';
                    //li.appendChild(a);
                    li.appendChild(span);
                    li.appendChild(div);
                    console.log(notification.at);
                    let timmy = notification.at * 1000;
                    let dt = new Date(timmy);
                    div.textContent = notification.title + ' @ ' + dt.toLocaleString();
                    badge.textContent = notification.badge;
                    div.appendChild(badge);

                    span.setAttribute('note-id', notification.id);
                    list.appendChild(li);

                    console.log(notification.id);
                    console.log(notification.title);
                    console.log(notification.badge);
                    console.log(notification.text);
                    console.log(notification.icon);

                    span.addEventListener('click', function (ev) {
                        let deleteIcon = ev.currentTarget;
                        let listItem = deleteIcon.parentElement;
                        let id = deleteIcon.getAttribute('note-id');
                        app.localNote.cancel(id, function () {
                            listItem.parentElement.removeChild(listItem);
                        });
                    })
                });
            });
        });
    },
    saveNew: function (ev) {
        ev.preventDefault();
        //create a new notification with the details from the form
        let num = Math.floor(Math.random() * 6) + 1;
        app.localNote.getAllIds(function (ids) {
            console.dir(ids);
            let last = ids[ids.length - 1];
            last += 1;
            console.log(last);

            let title = document.getElementById('title').value;
            let msg = document.getElementById('msg').value;
            let timeString = document.getElementById('time').value;
            console.log('timestring', timeString);
            //once we have the id then we can create a new notification
            let myDate = new Date(timeString);
            //let min = myDate.getMinutes() + 1; //not checking for end of month...
            //myDate.setMinutes(min);
            console.log('setting notification with id');
            app.localNote.schedule({
                id: last,
                title: title,
                text: msg,
                icon: "./img/icon.png",
                at: myDate,
                badge: num,
                data: {
                    myProp: 'this string',
                    otherProp: 123,
                    custom: 'data'
                }
            });
        });
    }
};

app.init();
