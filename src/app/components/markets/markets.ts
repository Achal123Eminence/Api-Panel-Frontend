import { Component, OnInit, signal, inject,computed } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Api } from '../../core/service/api';
import { FormsModule } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-markets',
  imports: [RouterModule, JsonPipe, CommonModule,FormsModule],
  templateUrl: './markets.html',
  styleUrl: './markets.css'
})
export class Markets implements OnInit{
  private apiService = inject(Api);
  private activeRoute = inject(ActivatedRoute);
  cricketMarketList = signal<any[]>([]);
  cricketMarketBookList = signal<any[]>([]);
  isloading = false;
  eventId: any;
  sportId:any

  Math = Math;

  // Pagination state
  pageSize = signal<number>(10);
  searchTerm = signal('');
  currentPage = signal(1);

  // Derived data using Angular Signals
  filteredList = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.cricketMarketList().filter(
      (item) =>
        item.marketName.toLowerCase().includes(term) ||
        item.marketId.toLowerCase().includes(term) 
    );
  });

  paginatedList = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredList().slice(start, start + this.pageSize());
  });

  totalPages = computed(
    () => Math.ceil(this.filteredList().length / this.pageSize()) || 1
  );

  constructor() {}

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe((param: any) => {
      this.eventId = param.get('eventId');
      this.sportId = param.get('sportId')
      this.fetchCricketMarketList(this.eventId);
    });
  }

  fetchCricketMarketList(id: any) {
    this.isloading = true;
    this.apiService.getMarketList({eventId:id}).subscribe({
      next: (res: any) => {
        this.isloading = false;
        this.cricketMarketList.set(res.markets);
        // this.showToast('Cricket Market list fetched successfully');
        console.log(this.cricketMarketList())
        this.currentPage.set(1);
      },
      error: (err) => {
        this.isloading = false
        console.log('Error in getting cricket Market list: ', err);
        this.showToast('Error in getting cricket Market list', true);
      },
    })
  }

  addSingleMarket(data:any){
    this.isloading = true;
    const payload = {
      eventId:data.event.id,
      marketId:data.marketId,
      marketName:data.marketName
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to Add this market?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Add it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.addSingleMarket(payload).subscribe({
          next: (res: any) => {
            this.isloading = false;
            this.showToast('Market Added successfully');
            this.fetchCricketMarketList(this.eventId);
          },
          error: (err) => {
            this.isloading = false;
            console.log('Error in Adding Market: ', err);
            this.showToast(`Error in Adding Market : ${err.error.message}`,true);
            this.fetchCricketMarketList(this.eventId);
          },
        });
      }
    });
  }

  removeSingleMarket(data:any){
    this.isloading = true;
    const payload = {
      eventId:data.event.id,
      marketId:data.marketId
    };
    
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to Remove this market?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Remove it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.removeSingleMarket(payload).subscribe({
          next: (res: any) => {
            this.isloading = false;
            this.showToast('Market Removed successfully');
            this.fetchCricketMarketList(this.eventId);
          },
          error: (err) => {
            this.isloading = false;
            console.log('Error in Adding Market: ', err);
            this.showToast(`Error in Adding Market : ${err.error.message}`,true);
            this.fetchCricketMarketList(this.eventId);
          },
        });
      }
    });
  }

  // openMarketDataModal(id: any) {
  //   if(id){
  //     this.isloading = true;
  //     this.apiService.getMarketBook({marketId:id}).subscribe({
  //       next:(res:any) => {
  //         this.isloading =false;
  //         this.cricketMarketBookList.set(res.marketBook[0]);
  //         const modal = document.getElementById('marketDataModal');
  //         if (modal) new bootstrap.Modal(modal).show();
  //         this.showToast('Cricket Market Book Data fetched successfully');
  //       },
  //       error: (err) => {
  //         this.isloading = false;
  //         console.log('Error in getting cricket Market book data: ', err);
  //         this.showToast('Error in getting cricket Market book data', true);
  //       }
  //     })
  //   }
  // }

  setPageSize(event: Event) {
    const select = event.target as HTMLSelectElement | null;
    if (select) {
      this.pageSize.set(Number(select.value));
      this.currentPage.set(1);
    }
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }


  async copyJson(): Promise<void> {
    try {
      const text = JSON.stringify(this.cricketMarketBookList(), null, 2);
      await navigator.clipboard.writeText(text);
      const modalEl = document.getElementById('marketDataModal');
      if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
      this.showToast('JSON copied to clipboard!');
    } catch (err) {
      this.showToast(`Failed to copy JSON: ${err}`);
    }
  }

  private showToast(message: string, isError: boolean = false): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: isError ? 'error' : 'success',
      title: message,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  }
}
