import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, timer} from 'rxjs';
import {AuthService} from '../../sharedServices/auth.service';
import {StorageService} from '../../sharedServices/storage.service';
import {Events} from '../../sharedServices/events.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
        private storageService: StorageService,
        private events: Events
    ) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if (this.authService.isLogged) {
            return true;
        } else {

          timer(1000).subscribe(() => {
            this.storageService.getObject('user').then(user => {

                if (user) {
                    // this.events.publish('userChange', user);
                    // this.router.navigateByUrl('/home');
                    this.authService.onLogin(user.email, user.password).then(login => {
                        if (login) {
                            this.router.navigateByUrl('/home');
                        } else {
                            return false;
                        }
                    });
                } else {
                    return false;
                }
            });
          });
        }

        console.log('Access denied!');
        this.router.navigateByUrl('/login');
        return false;

    }
}
