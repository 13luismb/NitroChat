import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SearchResponse} from '../../models/searchUser.model';
import {User} from '../../models/user.model';
import {Subscription} from 'rxjs';
import {ContactsService} from '../../services/contacts.service';
import {NewGroupService} from '../../services/new-group.service';
import {AuthService} from '../../services/auth.service';
import {switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.page.html',
  styleUrls: ['./new-group.page.scss'],
})
export class NewGroupPage implements OnInit, OnDestroy {
  typeConversation: number;
  inputValue: string;
  userArray: SearchResponse;
  alreadySearched = false;
  myUser: User;
  userSub: Subscription;
  showAll = true;
  selectedUsers = [];
  filterUsers = { users: []};
  constructor(private route: ActivatedRoute,
              private contactsService: ContactsService,
              private newGroupService: NewGroupService,
              private router: Router,
              private auth: AuthService
              ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.typeConversation = +paramMap.get('typeConversation');
      this.userSub = this.auth.user.pipe(switchMap(user => {
        this.myUser = user;
        return this.contactsService.loadContacts();
      }), tap(searchResponse => {
        // @ts-ignore
        this.userArray = searchResponse;
        console.log(this.userArray);
        this.showAll = true;
        this.alreadySearched = true;
      })).subscribe();
    });
  }

  searchHandler() {
    const searchValue = this.inputValue.trim();
    if (searchValue !== '') {
      this.showAll = false;
      this.filterUsers.users = this.userArray.users.filter(el => el.displayName.toUpperCase().includes(searchValue.toUpperCase()) );
    } else {
      this.showAll = true;
    }
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onSelected(data: any) {
    this.selectedUsers.push(data.id);
  }

  onUnselected(data: any) {
    this.selectedUsers = this.selectedUsers.filter(id => data.id !== id );
  }
  createGroup() {
  this.newGroupService.group.subscribe(preGroup => {
      let safeAttachment: string;
      this.selectedUsers.push(this.myUser.id);
      if (preGroup.attachment) {
          safeAttachment = preGroup.attachment.replace('unsafe:', '').replace(/(\r\n\t|\n|\r\t)/gm, '');
      } else {
          safeAttachment = preGroup.attachment;
      }
      console.log(this.typeConversation);
    const newGroup = {
      typeConversation: this.typeConversation,
      users: this.selectedUsers,
      attachment: safeAttachment,
      converName: preGroup.name
    };
      this.newGroupService.createGroup(newGroup).subscribe(response => {
          const chatId = response.conversations_id;
          this.router.navigate(['/chat', chatId]);
      });

  });
  }

}
