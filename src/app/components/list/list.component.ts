import {Component, Input, OnInit} from '@angular/core';
import {List, ListsService} from '../../services/lists.service';
import {Song} from '../../services/songs.service';
import {faEdit, faTrash} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  constructor(public listService: ListsService) { }

  faEdit = faEdit;
  faRemove = faTrash;

  lists: List[];
  selectedList: List;

  ngOnInit() {
    this.lists = this.listService.reloadLists();
  }

  removeList(list: List) {
    this.listService.removeList(list);
    this.lists = this.listService.reloadLists();
  }


}
