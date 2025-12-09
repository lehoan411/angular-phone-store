import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { ProductService } from '../../services/ProductService';
import { OrderService } from '../../services/OrderService';
import { UserService } from '../../services/UserService';
import { CurrencyPipe } from '../shared/pipes/CurencyPipe.pipe';
import { UpperCasePipe } from '../shared/pipes/UpperCasePipe.pipe';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from '../shared/storage/local-storage.service';

@Component({
    selector: 'order-root',
    standalone: true,
    imports: [FormsModule, CurrencyPipe, UpperCasePipe, CommonModule],
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {

    subscription = new Subscription();

    orderItems: any[] = [];
    orderInfo: any = null;
    buyer: any = null;
    totalPrice = 0;

    constructor(
        private orderService: OrderService,
        private productService: ProductService,
        private userService: UserService,
        private localStorageService: LocalStorageService,
    ) { }

    ngOnInit(): void {
        this.subscription = combineLatest([
            this.orderService.getOrders(),
            this.productService.getProducts(),
            this.userService.getUsers()
        ]).subscribe(([orders, products, users]) => {


            const token = this.localStorageService.getItem('token');
            let currentUserId = null;

            if (token) {
                const user = JSON.parse(atob(token));
                currentUserId = user.id;
            }



            const myOrder = orders.find(
                o => o.user === currentUserId && o.status === "Pending"
            );
            if (!myOrder) {
                this.orderInfo = null;
                this.orderItems = [];
                this.buyer = null;
                this.totalPrice = 0;
                return;
            }

            this.orderInfo = myOrder;
            this.totalPrice = myOrder.totalPrice;


            this.buyer = users.find(u => u.id === myOrder.user);


            this.orderItems = myOrder.products.map(productId => {
                const product = products.find(p => p.id === productId);
                return { product };
            });


        });
    }


    completePurchase(): void {
        if (!this.orderInfo) return;

        const updatedOrder = {
            ...this.orderInfo,
            status: 'Completed'
        };

        this.orderService.editOrder(updatedOrder).subscribe(() => {
            alert('Purchase completed successfully!');
            window.location.href = '/';
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }


}
