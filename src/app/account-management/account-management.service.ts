import { Member } from '../shared/model/member.model';
import { ApiService } from '../shared/service/util/api.service';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountManagementService {
  constructor(private apiService: ApiService) { }

  updatePrivateProfile(memberId: number, editProfileForm: FormGroup): Observable<any> {
    const profileData = editProfileForm.value;
    console.log(`Mise à jour du membre [${memberId}] avec les nouvelles informations suivantes :`, profileData);
    return this.apiService.put(`members/${memberId}/profile`, profileData);
  }

  updateMemberIntoWebStorage(member: Member) {
    localStorage.connectedUser = JSON.stringify(member);
  }
}
