import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { Alert } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import { AuthService, AuthResponseData } from "./auth.service";


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})

export class AuthComponent implements OnDestroy {
    isLoginMode = true
    isLoading = false
    error: string = null

    private closeSub: Subscription

    @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective

    constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) { }

    ngOnDestroy() {
        if (this.closeSub) this.closeSub.unsubscribe()
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode
    }

    onSubmit(form: NgForm) {
        if (!form.valid) return

        const email = form.value.email
        const password = form.value.password
        let authObservable: Observable<AuthResponseData>

        this.isLoading = true

        if (this.isLoginMode) authObservable = this.authService.login(email, password)
        else authObservable = this.authService.signup(email, password)

        authObservable.subscribe(res => {
            console.log(res)
            this.isLoading = false
            this.router.navigate(['/recipes'])
        },
            errorMessage => {
                console.log(errorMessage)
                this.error = errorMessage
                this.showErrorAlert(errorMessage)
                this.isLoading = false
            })
        form.reset()
    }

    onHandleError() {
        this.error = null
    }

    private showErrorAlert(message: string) {
        const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(Alert)
        const hostViewContainerRef = this.alertHost.viewContainerRef
        hostViewContainerRef.clear()
        const componentRef = hostViewContainerRef.createComponent(alertCmpFactory)
        componentRef.instance.message = message
        this.closeSub = componentRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe()
            hostViewContainerRef.clear()
        })
    }
}