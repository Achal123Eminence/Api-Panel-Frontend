import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Api } from '../../core/service/api';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-default-settings',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './default-settings.html',
  styleUrl: './default-settings.css',
})
export class DefaultSettings implements OnInit {
  private apiService = inject(Api);
  selectedSport: string = '4';
  allDataList = signal<any[]>([]);

  gradeA = signal<any[]>([]);
  gradeB = signal<any[]>([]);
  gradeC = signal<any[]>([]);

  isloading = false;

  constructor() {}

  ngOnInit(): void {
    this.fetchAllData(this.selectedSport);
  }

  fetchAllData(id: any) {
    this.isloading = true;
    this.apiService.getDefaultSetting().subscribe({
      next: (res: any) => {
        this.isloading = false;
        this.allDataList.set(res.data);
        if (res) {
          this.selectedSport = id;
          const filteredData = this.allDataList().filter((m) => m.sport === id);

          // Divide into 3 arrays and sort by id
          this.gradeA.set(
            filteredData
              .filter((m) => m.gradeType === 'A')
              .sort((a, b) => a.id - b.id)
          );

          this.gradeB.set(
            filteredData
              .filter((m) => m.gradeType === 'B')
              .sort((a, b) => a.id - b.id)
          );

          this.gradeC.set(
            filteredData
              .filter((m) => m.gradeType === 'C')
              .sort((a, b) => a.id - b.id)
          );

          console.log('Grade A:', this.gradeA());
          console.log('Grade B:', this.gradeB());
          console.log('Grade C:', this.gradeC());
        }
      },
      error: (err) => {
        this.isloading = false;
        console.log('Error in fetching all default settings data!!');
      },
    });
  }

  updateRow(item: any) {
    const payload = {
      sport: this.selectedSport,
      id: item.id,
      gradeType: item.gradeType,
      updates: {
        marketName: item.marketName,
        status: item.status,
        preMinStake: item.preMinStake,
        preMaxStake: item.preMaxStake,
        preMaxPL: item.preMaxPL,
        minStake: item.minStake,
        maxStake: item.maxStake,
        maxPL: item.maxPL,
        delay: item.delay,
        oddsLimit: item.oddsLimit,
      },
    };

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update this market setting?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.updateDefaultSetting(payload).subscribe({
          next: (res: any) => {
            this.showToast('Market updated successfully');
          },
          error: (err) => {
            this.showToast(
              `Failed to update market: ${err.error.message}`,
              true
            );
          },
        });
      }
    });
  }

  allowDecimal(event: KeyboardEvent) {
    const char = event.key;
    const input = event.target as HTMLInputElement; // direct input element
    const currentValue = input.value || '';

    // Allow digits 0–9
    if (/^[0-9]$/.test(char)) {
      return;
    }

    // Allow only one decimal point
    if (char === '.' && !currentValue.includes('.')) {
      return;
    }

    // Block everything else
    event.preventDefault();
  }

  onDecimalPaste(event: ClipboardEvent) {
    const pasteData = event.clipboardData?.getData('text') || '';
    // Allow only numbers with a single decimal point
    if (!/^\d*\.?\d*$/.test(pasteData)) {
      event.preventDefault();
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