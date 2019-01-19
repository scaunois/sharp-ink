
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from './../auth.service';
import { Member } from 'src/app/shared/model/member.model';

/**
 * Guard pour vérifier si l'id de l'utilisaterur et l'id du membre possédant la page coïncident
 * (par exemple la page d'édition d'une histoire, il ne suffit pas d'être authentifié, encore faut-il
 * être l'auteur de l'histoire).
 */
@Injectable()
export class MemberGuard implements CanActivate {
  connectedMemberId: number = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.connectedMemberSubject.subscribe(
      (member: Member) => {
        this.connectedMemberId = member.id;
      }
    );
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const requestedMemberId = +route.params['id'];
    console.log(requestedMemberId);
    console.log(this.connectedMemberId);
    if (this.connectedMemberId === requestedMemberId) {
      return true;
    } else {
      this.router.navigate(['/403-acces-interdit']);
    }
  }
}
