import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppSharedModule } from "../../../../share.module";
import { RouterModule, Routes } from "@angular/router";
import { SetmealComponent } from "./setmealmanagement.component";
import { SetmealTableComponent } from "./table/table.component";
import { SetmealDetailComponent } from "./detail/detail.component";

const routes: Routes = [{ path: "", component: SetmealComponent }];

@NgModule({
  declarations: [
    SetmealComponent,
    SetmealTableComponent,
    SetmealDetailComponent
  ],
  imports: [CommonModule, AppSharedModule, RouterModule.forChild(routes)]
})
export class SetmealmanagementModule {}
