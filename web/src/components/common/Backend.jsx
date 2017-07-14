import 'isomorphic-fetch'

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export default class Backend {
    constructor(history) {
        this.history = history;
        this.loggedIn = false;
        this.mail = '';
        this.profile = '';
    }

    isLoggedIn() {
        return this.loggedIn;
    }

    isAdmin() {
        return this.profile.roles.contains('admin');
    }

    getMail() {
        ( this.mail || getCookie('email') )
    }

    async login(mail, password) {
        return await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `email=${encodeURIComponent(mail)}&password=${encodeURIComponent(password)}}`,
        })
        .catch(ex => {
            console.error('Network Error', ex);
            throw ex;
        })
        .then((response) => {
            if (response.status == 403) {
                return false
            } else if (response.ok) {
                setCookie('email', mail);
                this.loggedIn = true;
                this.mail = mail;
                this.profile = this.getProfile();
            } else {
                throw {
                    status: response.status,
                    error: await response.text(),
                }
            }
        });
    }

    register(firstname, lastname, mail, password, password_confirm, role) {
        if (password != password_confirm) {
            alert("Passwords do not match");
            return false;
        }

        return this.postJson('/api/users', {
            "first_name": firstname,
            "last_name": lastname,
            "email": mail,
            "password": password,
            "bio": "",
            "roles": role
        })
    }

    async logout() {
        return await fetch('/api/users/logout', {
            credentials: 'include'
        })
        .catch(ex => {
            console.error('Network Error', ex);
            throw ex;
        })
        .then((response) => {
            if (response.ok) {
                return true;
            } else {
                throw {
                    status: response.status,
                    error: await response.text(),
                }
            }
        })
    }

    // returns json
    async getJson(url) {
        let response = await fetch(url, {
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        })
        .catch(ex => {
            console.error('Network Error', ex);
            throw ex;
        });

        if (response.status == 403) {
            this.loggedIn = false;
            this.mail = '';
            this.profile = '';
            this.history.replace('/');
            return undefined;
        } else if (response.status == 404) {
            return null;
        } else if (response.ok) {
            return await response.json();
        } else {
            throw {
                status: response.status,
                error: await response.text()
            }
        }
    }

    // deletes and returns 404 or 200
    async delete(url) {
        let response = await fetch(url, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .catch(ex => {
            console.error('Network Error', ex);
            throw ex;
        });

        if (response.status == 403) {
            this.loggedIn = false;
            this.mail = '';
            this.profile = '';
            this.history.replace('/');
            return undefined;
        } else if (response.status == 404) {
            return false;
        } else if (response.ok) {
            return true;
        } else {
            throw {
                status: response.status,
                error: await response.text()
            }
        }
    }

    // returns new id, email, etc, depending on the created object
    async postJson(url, payload) {
        let response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .catch(ex => {
            console.error('Network Error', ex);
            throw ex;
        });

        if (response.status == 403) {
            this.loggedIn = false;
            this.mail = '';
            this.profile = '';
            this.history.replace('/');
            return undefined;
        } else if (response.ok) {
            return await response.text();
        } else {
            throw {
                status: response.status,
                error: await response.text()
            }
        }
    }

    // Updates and returns 200 or 404
    async putJson(url, payload) {
        let response = await fetch(url, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .catch(ex => {
            console.error('Network Error', ex);
            throw ex;
        });

        if (response.status == 403) {
            this.loggedIn = false;
            this.mail = '';
            this.profile = '';
            this.history.replace('/');
            return undefined;
        } else if (response.status == 404) {
            return false;
        } else if (response.ok) {
            return true;
        } else {
            throw {
                status: response.status,
                error: await response.text()
            }
        }
    }

    addProject(project) {
        return this.postJson('/api/projects', project);
    }

    getProjects() {
        return this.getJson('/api/projects');
    }

    getAuthors() {
        return this.getJson('/api/projects/authors');
    }

    getTags() {
        return this.getJson('/api/projects/tags');
    }

    getProject(id) {
        return this.getJson('/api/projects/'+id);
    }

    updateProject(id, payload) {
        return this.putJson('/api/projects'+id, payload);
    }

    deleteProject(id) {
        return this.delete('/api/projects/'+id);
    }

    async addProjectComment(id, message) {
        let response = await fetch(`/api/projects/${encodeURIComponent(id)}/comment`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: message
        })
        .catch(ex => {
            console.error('Network error', ex);
            throw ex;
        });

        if (response.status == 403) {
            this.loggedIn = false;
            this.mail = '';
            this.profile = '';
            this.history.replace('/');
            return undefined;
        } else if (response.ok) {
            return await response.text();
        } else {
            throw {
                status: response.status,
                error: await response.text()
            }
        }
    }

    getProjectComments(id) {
        return this.getJson(`/api/projects/${encodeURIComponent(id)}/comment`);
    }

    deleteProjectComments(id) {
        return this.delete(`/api/projects/${encodeURIComponent(id)}/comment`);
    }

    async updateProjectComment(projId, commentId, message) {
        let response = await fetch(`/api/projects/${encodeURIComponent(projId)}/comment/${encodeURIComponent(commentId)}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: message
        })
        .catch(ex => {
            console.error('Network error', ex);
            throw ex;
        });

        if (response.status == 403) {
            this.loggedIn = false;
            this.mail = '';
            this.profile = '';
            this.history.replace('/');
            return undefined;
        } else if (response.status == 404) {
            return false;
        } else if (response.ok) {
            return true;
        } else {
            throw {
                status: response.status,
                error: await response.text()
            }
        }
    }

    deleteProjectComment(projId, commentId) {
        return this.delete(`/api/projects/${encodeURIComponent(projId)}/comment/${encodeURIComponent(commentId)}`);
    }

    async shareProjectToUser(id, mail) {
        let response = await fetch(`/api/projects/${encodeURIComponent(id)}/share/${encodeURIComponent(mail)}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .catch(ex => {
            console.error('Network error', ex);
            throw ex;
        });

        if (response.status == 403) {
            this.loggedIn = false;
            this.mail = '';
            this.profile = '';
            this.history.replace('/');
            return undefined;
        } else if (response.ok) {
            return await response.text();
        } else {
            throw {
                status: response.status,
                error: await response.text()
            }
        }
    }

    shareProjectToUsers(id, mails) {
        return this.postJson(`/api/projects/${encodeURIComponent(id)}/share`, mails);
    }

    searchSimple(q, sort, order, offset = 0, count = 10) {
        let sortStr = sort ? "&sort="+encodeURIComponent(sort) : "";
        let orderStr = order ? "&order="+encodeURIComponent(order) : "";

        return this.getJson(`/api/projects/search/simple/?q=${encodeURIComponent(q)}${sortStr}${orderStr}&offset=${encodeURIComponent(offset)}&count=${encodeURIComponent(count)}`);
    }

    saveSearchSimple(title, q, sort, order, offset = 0, count = 10) {
        let sortStr = sort ? "&sort="+encodeURIComponent(sort) : "";
        let orderStr = order ? "&order="+encodeURIComponent(order) : "";

        return this.getJson(`/api/projects/search/simple/?q=${encodeURIComponent(q)}${sortStr}${orderStr}&offset=${encodeURIComponent(offset)}&count=${encodeURIComponent(count)}&save=${encodeURIComponent(title)}`);
    }

    searchAdvanced(q, sort, order, offset = 0, count = 10) {
        let sortStr = sort ? "&sort="+encodeURIComponent(sort) : "";
        let orderStr = order ? "&order="+encodeURIComponent(order) : "";

        return this.getJson(`/api/projects/search/advanced/?q=${encodeURIComponent(q)}${encodeURIComponent(sortStr)}${encodeURIComponent(orderStr)}&offset=${encodeURIComponent(offset)}&count=${encodeURIComponent(count)}`);
    }

    saveSearchAdvanced(title, q, sort, order, offset = 0, count = 10) {
        let sortStr = sort ? "&sort="+encodeURIComponent(sort) : "";
        let orderStr = order ? "&order="+encodeURIComponent(order) : "";

        return this.getJson(`/api/projects/search/advanced/?q=${encodeURIComponent(q)}${encodeURIComponent(sortStr)}${encodeURIComponent(orderStr)}&offset=${encodeURIComponent(offset)}&count=${encodeURIComponent(count)}&save=${encodeURIComponent(title)}`);
    }

    searchSaved(id, offset = 0, count = 10) {
        return this.getJson(`/api/projects/search/saved/${encodeURIComponent(id)}?offset=${encodeURIComponent(offset)}&count=${encodeURIComponent(count)}`);
    }

    getSavedSearches() {
        return this.getJson('/api/users/saved_searches');
    }

    deleteSavedSearch(id) {
        return this.delete('/api/users/saved_searches/'+encodeURIComponent(id));
    }

    getUsers() {
        return this.getJson('/api/users');
    }

    async updateProfile(user) {
        if (await this.putJson('/api/users', user)) {
            this.profile = this.getProfile();
            return true;
        } else {
            return false;
        }
    }

    updatePassword(user) {
        return this.putJson('/api/users/password', user);
    }

    getProfile(mail = this.mail) {
        return this.getJson('/api/users/'+encodeURIComponent(mail));
    }

    getTagsOfUser(mail) {
        return this.getJson(`/api/users/${encodeURIComponent(mail)}/tags`);
    }

    getMyTags() {
        return this.getJson('/api/users/tags');
    }

    addBookmark(id) {
        return this.postJson('/api/users/bookmarks'+encodeURIComponent(id));
    }

    deleteBookmark(id) {
        return this.delete('/api/users/bookmarks'+encodeURIComponent(id));
    }

    getBookmarks() {
        return this.getJson('/api/users/bookmarks');
    }

    getNotifications() {
        return this.getJson('/api/users/notifications');
    }

    deleteNotification(id) {
        return this.delete('/api/users/notifications/'+encodeURIComponent(id));
    }
}
