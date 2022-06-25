import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../shared/data-storage.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class Header implements OnInit, OnDestroy {

    isAuthenticated = false
    collapsed = true
    private authSub: Subscription

    constructor(private dataStorageService: DataStorageService, private authService: AuthService) { }

    onSaveData() {
        this.dataStorageService.storageRecipes()
    }

    onFetchData() {
        this.dataStorageService.fetchRecipes().subscribe()
    }

    onLogout(){
        this.authService.logout()
    }

    ngOnInit() {
        this.authSub = this.authService.user.subscribe(user=>{
            this.isAuthenticated = !!user
        })
    }

    ngOnDestroy() {
        this.authSub.unsubscribe()
    }


}