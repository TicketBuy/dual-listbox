//#region src/dual-listbox.js
var e = "dual-listbox", t = "dual-listbox__container", n = "dual-listbox__available", r = "dual-listbox__selected", i = "dual-listbox__title", a = "dual-listbox__item", o = "dual-listbox__buttons", s = "dual-listbox__button", c = "dual-listbox__search", l = "dual-listbox__item--selected", u = "up", d = "down", f = class f {
	constructor(e, t = {}) {
		this.setDefaults(), this.dragged = null, this.options = [], f.isDomElement(e) ? this.select = e : this.select = document.querySelector(e), this._initOptions(t), this._initReusableElements(), t.options === void 0 ? this._splitOptions(this.select.options) : this.options = t.options, this._buildDualListbox(this.select.parentNode), this._addActions(), this.showSortButtons && this._initializeSortButtons(), this.redraw();
	}
	setDefaults() {
		this.availableTitle = "Available options", this.selectedTitle = "Selected options", this.showAddButton = !0, this.addButtonText = "add", this.showRemoveButton = !0, this.removeButtonText = "remove", this.showAddAllButton = !0, this.addAllButtonText = "add all", this.showRemoveAllButton = !0, this.removeAllButtonText = "remove all", this.searchPlaceholder = "Search", this.showSortButtons = !1, this.sortFunction = (e, t) => e.selected ? -1 : t.selected ? 1 : e.order < t.order ? -1 : e.order > t.order ? 1 : 0, this.upButtonText = "up", this.downButtonText = "down", this.enableDoubleClick = !0, this.draggable = !0;
	}
	changeOrder(e, t) {
		let n = this.options.findIndex((t) => t.value === e.dataset.id), r = this.options.splice(n, 1);
		this.options.splice(t, 0, r[0]);
	}
	addOptions(e) {
		e.forEach((e) => {
			this.addOption(e);
		});
	}
	addOption(e, t = null) {
		t ? this.options.splice(t, 0, e) : this.options.push(e);
	}
	addEventListener(e, t) {
		this.dualListbox.addEventListener(e, t);
	}
	changeSelected(e) {
		let t = this.options.find((t) => t.value === e.dataset.id);
		t.selected = !t.selected, this.redraw(), setTimeout(() => {
			let n = document.createEvent("HTMLEvents");
			t.selected ? (n.initEvent("added", !1, !0), n.addedElement = e, n.select = this.select) : (n.initEvent("removed", !1, !0), n.removedElement = e, n.select = this.select), this.dualListbox.dispatchEvent(n);
		}, 0);
	}
	actionAllSelected(e) {
		e && e.preventDefault(), this.options.forEach((e) => e.selected = !0), this.redraw(), setTimeout(() => {
			let e = document.createEvent("HTMLEvents");
			e.initEvent("addedAll", !1, !0), e.select = this.select, this.dualListbox.dispatchEvent(e);
		}, 0);
	}
	actionAllDeselected(e) {
		e && e.preventDefault(), this.options.forEach((e) => e.selected = !1), this.redraw(), setTimeout(() => {
			let e = document.createEvent("HTMLEvents");
			e.initEvent("removedAll", !1, !0), e.select = this.select, this.dualListbox.dispatchEvent(e);
		}, 0);
	}
	redraw() {
		!this.showSortButtons && !this.draggable && this.options.sort(this.sortFunction), this.updateAvailableListbox(), this.updateSelectedListbox(), this.syncSelect();
	}
	searchLists(e, t) {
		let n = t.querySelectorAll(`.${a}`), r = e.toLowerCase();
		for (let e = 0; e < n.length; e++) {
			let t = n[e];
			t.textContent.toLowerCase().indexOf(r) === -1 ? t.style.display = "none" : t.style.display = "list-item";
		}
	}
	updateAvailableListbox() {
		this._updateListbox(this.availableList, this.options.filter((e) => !e.selected));
	}
	updateSelectedListbox() {
		this._updateListbox(this.selectedList, this.options.filter((e) => e.selected));
	}
	syncSelect() {
		for (; this.select.firstChild;) this.select.removeChild(this.select.lastChild);
		this.options.forEach((e) => {
			let t = document.createElement("option");
			t.value = e.value, t.innerText = e.text, e.selected && t.setAttribute("selected", "selected"), this.select.appendChild(t);
		});
	}
	_updateListbox(e, t) {
		for (; e.firstChild;) e.removeChild(e.firstChild);
		t.forEach((t) => {
			e.appendChild(this._createListItem(t));
		});
	}
	actionItemSelected(e) {
		e.preventDefault();
		let t = this.availableList.querySelector(`.${l}`);
		t && this.changeSelected(t);
	}
	actionItemDeselected(e) {
		e.preventDefault();
		let t = this.selectedList.querySelector(`.${l}`);
		t && this.changeSelected(t);
	}
	_actionItemDoubleClick(e, t = null) {
		t && (t.preventDefault(), t.stopPropagation()), this.enableDoubleClick && this.changeSelected(e);
	}
	_actionItemClick(e, t, n = null) {
		n && n.preventDefault();
		let r = t.querySelectorAll(`.${a}`);
		for (let t = 0; t < r.length; t++) {
			let n = r[t];
			n !== e && n.classList.remove(l);
		}
		e.classList.contains(l) ? e.classList.remove(l) : e.classList.add(l);
	}
	_addActions() {
		this._addButtonActions(), this._addSearchActions();
	}
	_addButtonActions() {
		this.add_all_button.addEventListener("click", (e) => this.actionAllSelected(e)), this.add_button.addEventListener("click", (e) => this.actionItemSelected(e)), this.remove_button.addEventListener("click", (e) => this.actionItemDeselected(e)), this.remove_all_button.addEventListener("click", (e) => this.actionAllDeselected(e));
	}
	_addClickActions(e) {
		return e.addEventListener("dblclick", (t) => this._actionItemDoubleClick(e, t)), e.addEventListener("click", (t) => this._actionItemClick(e, this.dualListbox, t)), e;
	}
	_addSearchActions() {
		this.search_left.addEventListener("change", (e) => this.searchLists(e.target.value, this.availableList)), this.search_left.addEventListener("keyup", (e) => this.searchLists(e.target.value, this.availableList)), this.search_right.addEventListener("change", (e) => this.searchLists(e.target.value, this.selectedList)), this.search_right.addEventListener("keyup", (e) => this.searchLists(e.target.value, this.selectedList));
	}
	_buildDualListbox(e) {
		this.select.style.display = "none", this.dualListBoxContainer.appendChild(this._createList(this.search_left, this.availableListTitle, this.availableList)), this.dualListBoxContainer.appendChild(this.buttons), this.dualListBoxContainer.appendChild(this._createList(this.search_right, this.selectedListTitle, this.selectedList)), this.dualListbox.appendChild(this.dualListBoxContainer), e.insertBefore(this.dualListbox, this.select);
	}
	_createList(e, t, n) {
		let r = document.createElement("div");
		return r.appendChild(e), r.appendChild(t), r.appendChild(n), r;
	}
	_createButtons() {
		this.buttons = document.createElement("div"), this.buttons.classList.add(o), this.add_all_button = document.createElement("button"), this.add_all_button.innerHTML = this.addAllButtonText, this.add_button = document.createElement("button"), this.add_button.innerHTML = this.addButtonText, this.remove_button = document.createElement("button"), this.remove_button.innerHTML = this.removeButtonText, this.remove_all_button = document.createElement("button"), this.remove_all_button.innerHTML = this.removeAllButtonText;
		let e = {
			showAddAllButton: this.add_all_button,
			showAddButton: this.add_button,
			showRemoveButton: this.remove_button,
			showRemoveAllButton: this.remove_all_button
		};
		for (let t in e) if (t) {
			let n = this[t], r = e[t];
			r.setAttribute("type", "button"), r.classList.add(s), n && this.buttons.appendChild(r);
		}
	}
	_createListItem(e) {
		let t = document.createElement("li");
		for (let n in e.dataset) e.dataset.hasOwnProperty(n) && (t.dataset[n] = e.dataset[n]);
		return t.classList.add(a), t.innerHTML = e.text, t.dataset.id = e.value, this._liListeners(t), this._addClickActions(t), this.draggable && t.setAttribute("draggable", "true"), t;
	}
	_liListeners(e) {
		e.addEventListener("dragstart", (e) => {
			this.dragged = e.currentTarget, e.currentTarget.classList.add("dragging");
		}), e.addEventListener("dragend", (e) => {
			e.currentTarget.classList.remove("dragging");
		}), e.addEventListener("dragover", (e) => {
			e.preventDefault();
		}, !1), e.addEventListener("dragenter", (e) => {
			e.target.classList.add("drop-above");
		}), e.addEventListener("dragleave", (e) => {
			e.target.classList.remove("drop-above");
		}), e.addEventListener("drop", (e) => {
			e.preventDefault(), e.stopPropagation(), e.target.classList.remove("drop-above");
			let t = this.options.findIndex((t) => t.value === e.target.dataset.id);
			e.target.parentElement === this.dragged.parentElement ? (this.changeOrder(this.dragged, t), this.redraw()) : (this.changeSelected(this.dragged), this.changeOrder(this.dragged, t), this.redraw());
		});
	}
	_createSearchLeft() {
		this.search_left = document.createElement("input"), this.search_left.classList.add(c), this.search_left.placeholder = this.searchPlaceholder;
	}
	_createSearchRight() {
		this.search_right = document.createElement("input"), this.search_right.classList.add(c), this.search_right.placeholder = this.searchPlaceholder;
	}
	_createDragListeners() {
		[this.availableList, this.selectedList].forEach((e) => {
			e.addEventListener("dragover", (e) => {
				e.preventDefault();
			}, !1), e.addEventListener("dragenter", (e) => {
				e.target.classList.add("drop-in");
			}), e.addEventListener("dragleave", (e) => {
				e.target.classList.remove("drop-in");
			}), e.addEventListener("drop", (t) => {
				t.preventDefault(), t.target.classList.remove("drop-in"), (e.classList.contains("dual-listbox__selected") || e.classList.contains("dual-listbox__available")) && this.changeSelected(this.dragged);
			});
		});
	}
	_initOptions(e) {
		for (let t in e) e.hasOwnProperty(t) && (this[t] = e[t]);
	}
	_initReusableElements() {
		this.dualListbox = document.createElement("div"), this.dualListbox.classList.add(e), this.select.id && this.dualListbox.classList.add(this.select.id), this.dualListBoxContainer = document.createElement("div"), this.dualListBoxContainer.classList.add(t), this.availableList = document.createElement("ul"), this.availableList.classList.add(n), this.selectedList = document.createElement("ul"), this.selectedList.classList.add(r), this.availableListTitle = document.createElement("div"), this.availableListTitle.classList.add(i), this.availableListTitle.innerText = this.availableTitle, this.selectedListTitle = document.createElement("div"), this.selectedListTitle.classList.add(i), this.selectedListTitle.innerText = this.selectedTitle, this._createButtons(), this._createSearchLeft(), this._createSearchRight(), this.draggable && setTimeout(() => {
			this._createDragListeners();
		}, 10);
	}
	_splitOptions(e) {
		[...e].forEach((e, t) => {
			this.addOption({
				text: e.innerHTML,
				value: e.value,
				selected: e.attributes.selected || e.selected || !1,
				dataset: e.dataset,
				order: t
			});
		});
	}
	_initializeSortButtons() {
		let e = document.createElement("button");
		e.classList.add("dual-listbox__button"), e.innerHTML = this.upButtonText, e.addEventListener("click", (e) => this._onSortButtonClick(e, u));
		let t = document.createElement("button");
		t.classList.add("dual-listbox__button"), t.innerHTML = this.downButtonText, t.addEventListener("click", (e) => this._onSortButtonClick(e, d));
		let n = document.createElement("div");
		n.classList.add("dual-listbox__buttons"), n.appendChild(e), n.appendChild(t), this.dualListBoxContainer.appendChild(n);
	}
	_onSortButtonClick(e, t) {
		e.preventDefault();
		let n = this.dualListbox.querySelector(".dual-listbox__item--selected");
		if (this.options.find((e) => e.value === n.dataset.id), n) {
			let e = this._getNewIndex(n, t);
			e >= 0 && (this.changeOrder(n, e), this.redraw());
		}
		setTimeout(() => {
			let e = document.createEvent("HTMLEvents");
			e.initEvent("reordered", !1, !0), e.select = this.select, this.dualListbox.dispatchEvent(e);
		}, 0);
	}
	_getNewIndex(e, t) {
		let n = this.options.filter((e) => e.selected), r = n.findIndex((t) => t.value === e.dataset.id), i = r;
		return u === t ? --i : d === t && r < n.length - 1 && (i += 1), i;
	}
	static isDomElement(e) {
		return typeof HTMLElement == "object" ? e instanceof HTMLElement : e && typeof e == "object" && e.nodeType === 1 && typeof e.nodeName == "string";
	}
};
//#endregion
export { f as DualListbox, f as default };

//# sourceMappingURL=dual-listbox.js.map