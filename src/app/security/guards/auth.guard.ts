import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../../sharedServices/auth.service';
import {StorageService} from '../../sharedServices/storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
        private storageService: StorageService,
    ) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        if (this.authService.isLogged) {
            return true;
        } else {
            this.storageService.getObject('user').then(user => {

                if (user) {
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
        }

        console.log('Access denied!');
        this.router.navigateByUrl('/login');
        return false;

    }
}
