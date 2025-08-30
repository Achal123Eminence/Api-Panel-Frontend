import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Api } from '../../core/service/api';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule,FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit{

  private apiService = inject(Api);
  cricketCompetitionList = signal<any[]>([]);
  isloading = false;
  selectedSport: string = '4';
  Math = Math; 

  // Pagination state
  pageSize = signal<number>(10);
  searchTerm = signal('');
  currentPage = signal(1);

  // Derived data using Angular Signals
  filteredList = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.cricketCompetitionList().filter(item =>
      item.competitionName.toLowerCase().includes(term) ||
      item.competitionRegion?.toLowerCase().includes(term)
    );
  });

  paginatedList = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredList().slice(start, start + this.pageSize());
  });

  totalPages = computed(() => 
    Math.ceil(this.filteredList().length / this.pageSize()) || 1
  );

  constructor(){}

  ngOnInit(): void {
    this.fetchCricketCompetitionList("4");
  }

  fetchCricketCompetitionList(id:any){
    this.selectedSport = id;
    this.isloading = true;
    this.apiService.getCompetitionList(id).subscribe({
      next: (res:any) => {
        this.isloading = false;
        this.cricketCompetitionList.set(res?.competitions || []);
        console.log(this.cricketCompetitionList())
        this.currentPage.set(1);
        // if(this.selectedSport=="4"){
        //   this.showToast("Cricket competition list fetched successfully");
        // }
        // if(this.selectedSport=="1"){
        //   this.showToast("Soccer competition list fetched successfully");
        // }
        // if(this.selectedSport=="2"){
        //   this.showToast("Tennis competition list fetched successfully");
        // }
      },
      error: (err) =>{
        this.isloading = false;
        console.log('Error in getting cricket competition list: ',err);
        this.showToast('Error in getting cricket competition list',true);
      }
    })
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
