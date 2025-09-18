import { Component, OnInit, signal, inject,computed } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Api } from '../../core/service/api';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule,FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-m-type',
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './m-type.html',
  styleUrl: './m-type.css'
})
export class MType implements OnInit{
private apiService = inject(Api);
  private fb = inject(FormBuilder);
  cricketAllEventList = signal<any[]>([]);
  isloading = false;
  Math = Math;
  selectedSport: string = '4';
  addEventForm!: FormGroup;
  selectedEvent: any = null;

  // Pagination state
  pageSize = signal<number>(50);
  searchTerm = signal('');
  currentPage = signal(1);

  // Derived data using Angular Signals
  filteredList = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.cricketAllEventList().filter((item) =>
      item.eventName.toLowerCase().includes(term)
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
    this.fetchCricketAllEventList(this.selectedSport);
  }

  fetchCricketAllEventList(id: any) {
    this.selectedSport = id;
    this.isloading = true;
    this.apiService.getSavedEventList({sportId:this.selectedSport}).subscribe({
      next: (res: any) => {
        this.isloading = false;
        this.cricketAllEventList.set(res.data);
        console.log(this.cricketAllEventList());
        // this.showToast('Cricket All Event list fetched successfully');
        this.currentPage.set(1);
      },
      error: (err) => {
        this.isloading = false;
        console.log('Error in getting cricket all event list: ', err);
        this.showToast(
          `Error in getting cricket all event list:${err.error.message}`,
          true
        );
      },
    });
  }

  deleteEvent(data: any) {
    this.isloading = true;
      const payload = {
        _id: data._id
      };
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to Delete this Match?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete it!',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.apiService.deleteEvent(payload).subscribe({
            next: (res: any) => {
              this.isloading = false;
              this.fetchCricketAllEventList(this.selectedSport);
              this.showToast('Event Deleted successfully');
            },
            error: (err) => {
              this.isloading = false;
              this.fetchCricketAllEventList(this.selectedSport);
              this.showToast(
                `Failed to Deleted Event: ${err.error.message}`,
                true
              );
            },
          });
        }
      });
    }
  
    removeEvent(data: any) {
      this.isloading = true;
      const payload = {
        _id: data._id
      };
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to Rollback this Match?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Rollback it!',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.apiService.rollBackEvent(payload).subscribe({
            next: (res: any) => {
              this.isloading = false;
              this.fetchCricketAllEventList(this.selectedSport);
              this.showToast('Event Rollbacked successfully');
            },
            error: (err) => {
              this.isloading = false;
              this.fetchCricketAllEventList(this.selectedSport);
              this.showToast(
                `Failed to Rollback Event: ${err.error.message}`,
                true
              );
            },
          });
        }
      });
    }

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
