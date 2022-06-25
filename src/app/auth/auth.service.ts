import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";

export interface AuthResponseData {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registreted?: boolean
}

@Injectable({ providedIn: 'root' })

export class AuthService {
    user = new BehaviorSubject<User>(null)
    apiKey = 'AIzaSyDzPSEr5dijlSpxWjIaw5qY7ab4oolgbEQ'
    private tokenExpirationTimeout: any

    constructor(private http: HttpClient, private router: Router) { }

    signup(email: string, password: string) {
        console.log(this.apiKey);
        return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`,
            { email, password, returnSecureToken: true })
            .pipe(catchError(this.handleError), tap(resData => { this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn) }))
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>
            (`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`,
                { email, password, returnSecureToken: true })
            .pipe(catchError(this.handleError), tap(resData => { this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn) }))
    }

    logout() {
        this.user.next(null)
        this.router.navigate(['/auth'])
        localStorage.removeItem('userDB')
        if (this.tokenExpirationTimeout) clearTimeout(this.tokenExpirationTimeout)
        this.tokenExpirationTimeout = null
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimeout = setTimeout(() => {
            this.logout()
        }, expirationDuration)
    }

    autoLogin() {
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userDB'))
        if (!userData) return

        const loadedUser = new User(
            userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate)
        )
        if (loadedUser.token) {
            this.user.next(loadedUser)
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()

        }
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {

        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000)
        const user = new User(email, userId, token, expirationDate)
        this.user.next(user)
        this.autoLogout(expiresIn * 1000)
        localStorage.setItem('userDB', JSON.stringify(user))
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknow error occurred'
        console.log(errorRes);
        if (!errorRes.error || !errorRes.error.error) return throwError(errorMessage)

        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already'
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist.'
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password does not exist.'
                break;
        }
        return throwError(errorMessage)
    }

}