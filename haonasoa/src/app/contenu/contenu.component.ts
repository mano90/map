import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as d3 from 'd3';
import { BehaviorSubject } from 'rxjs';
import { DataSource } from '../Classes/DataSource';
import { Echelon } from '../Classes/Echelon';
import { Feat } from '../Classes/Feature';
import { Item } from '../Classes/item';
import { CommuneService } from '../services/commune.service';
import { DistrictService } from '../services/district.service';
import { RubriqueService } from '../services/rubrique.service';
import { StateService } from '../services/state.service';
import { StatistiqueCommune } from '../services/statistique-commune';

interface Measure {
  width: number;
  height: number;
}

@Component({
  selector: 'app-contenu',
  templateUrl: './contenu.component.html',
  styleUrls: ['./contenu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ContenuComponent implements AfterViewInit, OnInit, OnDestroy {
  dataSourceDistrict: DataSource[] = [];
  dataSourceCommune: DataSource[] = [];
  intervalData: number = 1;
  currentCommune: string = '';
  currentDistrict: string = '';

  statistiqueDistrict: boolean = true;
  xLegend: number = 0;
  rubriques: Item[] = [];
  statistiqueState: boolean = false;
  widthObservable = new BehaviorSubject({
    width: +this.elt.nativeElement.offsetWidth,
    height: +this.elt.nativeElement.offsetHeight,
  });

  dataStatistique: string = '';
  observer1: any;
  observer2: any;
  observer3: any;
  observer4: any;
  observer5: any;
  observer6: any;
  observer7: any;
  observer8: any;
  observer9: any;
  observer10: any;

  statisticI: number = -1;

  @ViewChild('showStatisticCommune', { static: true })
  showStatisticCommune: TemplateRef<any>;
  @ViewChild('modalRubrique', { static: true }) modalRubrique: TemplateRef<any>;
  @ViewChild('showDistrict', { static: true }) showDistrict: TemplateRef<any>;
  @ViewChild('showCommune', { static: true }) showCommune: TemplateRef<any>;

  collapsed: boolean = false;
  level: number = 0;
  there: any;
  @ViewChild('divider') divider: ElementRef = new ElementRef('div');
  width: number = 0;
  height: number = 0;

  focusDistrict: Feat = new Feat();
  focusElement: Feat = new Feat();
  previousElement: Feat = new Feat();

  timer: number = 0;
  scalinginit: number = 10000;
  middleDistrictX: number = 0;
  middleDistrictY: number = 0;
  middleDistrictK: number = 0;

  centered: any = null;
  projection = d3
    .geoMercator()
    .scale(10000)
    .translate([200, 280])
    .center([45.206426742441905, -21.304480155582597]);

  path = d3.geoPath().projection(this.projection);
  svg: any;

  region: any;
  district: any;
  names: any;
  commune: any;
  constructor(
    private elt: ElementRef,
    public stateService: StateService,
    private modalService: NgbModal,
    private communeService: CommuneService,
    private districtService: DistrictService,
    private rurbiqueService: RubriqueService,
    private statistiqueCommune: StatistiqueCommune
  ) {}
  ngOnInit() {
    this.observer3 = this.rurbiqueService
      .listeRubrique()
      .subscribe((res: Item[]) => {
        this.rubriques = res;
      });
    this.observer4 = this.stateService.currentCollapse.subscribe(
      (collapsed: boolean) => {
        this.collapsed = collapsed;
      }
    );
    if (this.elt.nativeElement.offsetWidth <= 992) {
      this.collapsed = true;
    } else {
      this.collapsed = false;
    }
  }
  initMap() {
    this.level = 0;
    let centroid = this.path.centroid(this.there);
    let x = centroid[0];
    let y = centroid[1];
    const bounds: any = d3.geoBounds(this.there);
    const customScale =
      this.height / d3.geoDistance(bounds[0], bounds[1]) / Math.sqrt(2);

    let k = customScale / this.scalinginit;
    this.setScale(this.width, this.height, k, x, y);
    this.commune.selectAll('path').attr('style', 'display: none');
    this.district.selectAll('path').classed('active', false);
    this.commune.selectAll('path').classed('active', false);
    this.focusElement = new Feat();
    this.focusDistrict = new Feat();
  }

  clickDistrict(pointer: any, d: any) {
    if (!this.statistiqueState) {
      if (this.collapsed == true) {
        this.modalService.open(this.showDistrict, {
          centered: true,
          backdrop: 'static',
        });
      }

      this.changeMessage(new Echelon(d.properties.Lib_dist));
      this.level = 1;
      this.commune.selectAll('path').attr('style', 'display: none');

      this.commune
        .selectAll('.' + d.properties.Lib_dist)
        .attr('style', 'display: block');
      let x: number, y: number, k: number;

      let centroid = this.path.centroid(d);
      x = centroid[0];
      y = centroid[1];
      const bounds: any = d3.geoBounds(d);
      const customScale =
        this.height / d3.geoDistance(bounds[0], bounds[1]) / Math.sqrt(2);

      k = customScale / this.scalinginit;
      this.middleDistrictX = x;
      this.middleDistrictY = y;
      this.middleDistrictK = k;
      this.centered = d;

      this.district.selectAll('path').each((element: Feat) => {
        if (this.centered && element == this.centered) {
          this.focusElement = element;
          this.focusDistrict = element;

          this.previousElement = element;

          this.district
            .select('#' + element.properties.Lib_dist)
            .classed('emptyOpacity', false);
          this.commune
            .selectAll('.' + element.properties.Lib_dist)
            .classed('emptyOpacity', false);
          this.observer5 = this.districtService
            .getItem(element.properties.Lib_dist)
            .subscribe((res: any) => {
              const contenuDistrict: any = JSON.parse(res.contenu);
              const keys: string[] = Object.keys(contenuDistrict);
              this.dataSourceDistrict = keys.map((element) => {
                const a: DataSource = new DataSource(
                  element,
                  contenuDistrict[element]
                );
                return a;
              });
              this.dataSourceCommune = [];
            });
        } else {
          this.district
            .select('#' + element.properties.Lib_dist)
            .classed('emptyOpacity', true);
        }
      });
      this.setScale(this.width, this.height, k, x, y);
    } else {
      if (this.statisticI !== -1) {
        this.centered = d;
        this.district.selectAll('path').each((element: Feat) => {
          if (this.centered && element == this.centered) {
            this.observer6 = this.statistiqueCommune
              .getByRubriqueAndNameDistrict(
                +this.statisticI,
                element.properties.Lib_dist
              )
              .subscribe((res: any) => {
                if (res.valeur == null)
                  this.dataStatistique =
                    element.properties.Lib_dist + ': ' + '0';
                else
                  this.dataStatistique =
                    element.properties.Lib_dist + ': ' + res.valeur;
              });
          }
        });
        this.modalService.open(this.showStatisticCommune, {
          centered: true,
          backdrop: 'static',
        });
      }
    }
  }

  clickCommune(pointer: any, d: any) {
    if (!this.statistiqueState) {
      if (this.collapsed == true) {
        this.modalService.open(this.showCommune, {
          centered: true,
          backdrop: 'static',
        });
      }

      this.level = 2;
      let x: number, y: number, k: number;
      this.changeMessage(new Echelon(d.properties.Lib_dist, d.properties.Nom));
      this.commune
        .selectAll('.' + d.properties.Lib_dist)
        .attr('style', 'display: block');
      let centroid = this.path.centroid(d);
      x = centroid[0];
      y = centroid[1];
      const bounds: any = d3.geoBounds(d);
      const customScale =
        this.height / d3.geoDistance(bounds[0], bounds[1]) / Math.sqrt(2);

      k = customScale / this.scalinginit;
      this.centered = d;

      this.commune.selectAll('path').each((element: Feat) => {
        if (this.centered && element == this.centered) {
          this.focusElement = element;
          this.commune
            .select('#id' + element.properties.Lib_com)
            .classed('active', true)
            .classed('emptyOpacity', false);
          this.observer7 = this.communeService
            .getItem(element.properties.Nom)
            .subscribe((res: any) => {
              const contenuCommune: any = JSON.parse(res.contenu);
              const keys: string[] = Object.keys(contenuCommune);
              this.dataSourceCommune = keys.map((element) => {
                const a: DataSource = new DataSource(
                  element,
                  contenuCommune[element]
                );
                return a;
              });
            });
        } else {
          this.commune
            .select('#id' + element.properties.Lib_com)
            .classed('active', false)
            .classed('emptyOpacity', true);
        }
      });
      this.setScale(this.width, this.height, k, x, y);
    } else {
      if (this.statisticI !== -1) {
        this.centered = d;

        this.commune.selectAll('path').each((element: Feat) => {
          if (this.centered && element == this.centered) {
            this.observer8 = this.statistiqueCommune
              .getByRubriqueAndName(
                +this.statisticI,
                element.properties.Lib_com
              )
              .subscribe((res: any) => {
                if (res == null)
                  this.dataStatistique =
                    element.properties.Lib_com + ': ' + '0';
                else
                  this.dataStatistique =
                    element.properties.Lib_com + ': ' + res.valeur;
              });
          }
        });
        this.modalService.open(this.showStatisticCommune, {
          centered: true,
          backdrop: 'static',
        });
      }
    }
  }

  private setScale(
    width: number,
    height: number,
    k: number,
    x: number,
    y: number
  ) {
    k = k + 0.5;
    if (this.statistiqueState === false) {
      this.district
        .transition()
        .duration(1750)
        .attr(
          'transform',
          'translate(' +
            width / 2 +
            ',' +
            height / 2 +
            ')scale(' +
            k +
            ')translate(' +
            -x +
            ',' +
            -y +
            ')'
        )
        .style('stroke-width', 1.5 / k + 'px');

      this.commune
        .transition()
        .duration(1750)
        .attr(
          'transform',
          'translate(' +
            width / 2 +
            ',' +
            height / 2 +
            ')scale(' +
            k +
            ')translate(' +
            -x +
            ',' +
            -y +
            ')'
        )
        .style('stroke-width', 1.5 / k + 'px');
    }
  }

  ngAfterViewInit(): void {
    this.observer1 = this.widthObservable.subscribe((res: Measure) => {
      this.changeMessage(new Echelon());
      this.width = res.width;
      this.height = res.height;
      this.dataSourceDistrict = [];
      this.dataSourceCommune = [];
      this.svg = d3.select('#idSVG').remove();
      if (this.statistiqueState === false) {
        this.svg = d3
          .select(this.divider.nativeElement)
          .append('svg')
          .attr('id', 'idSVG')
          .attr('width', this.width)
          .attr('height', this.height);
      } else {
        this.svg = d3
          .select(this.divider.nativeElement)
          .append('svg')
          .attr('id', 'idSVG')
          .attr('width', this.width * 0.8)
          .attr('height', this.height * 0.8);
      }

      this.mapper();
    });
    this.changeMessage(new Echelon());
    this.width = +this.elt.nativeElement.offsetWidth;
    this.height = +this.elt.nativeElement.offsetHeight;
    this.dataSourceDistrict = [];
    this.dataSourceCommune = [];
    this.svg = d3.select('#idSVG').remove();
    if (this.statistiqueState === false) {
      this.svg = d3
        .select(this.divider.nativeElement)
        .append('svg')
        .attr('id', 'idSVG')
        .attr('width', this.width)
        .attr('height', this.height);
    } else {
      this.svg = d3
        .select(this.divider.nativeElement)
        .append('svg')
        .attr('id', 'idSVG')
        .attr('width', this.width * 0.8)
        .attr('height', this.height * 0.8);
    }

    this.mapper();
  }

  resize2() {
    this.widthObservable.next({
      width: +this.elt.nativeElement.offsetWidth,
      height:
        +this.elt.nativeElement.offsetHeight -
        +this.elt.nativeElement.offsetTop,
    });

    this.observer1 = this.widthObservable.subscribe((res: Measure) => {
      this.changeMessage(new Echelon());
      this.width = res.width;
      this.height = res.height;
      this.dataSourceDistrict = [];
      this.dataSourceCommune = [];
      this.svg = d3.select('#idSVG').remove();
      if (this.statistiqueState === false) {
        this.svg = d3
          .select(this.divider.nativeElement)
          .append('svg')
          .attr('id', 'idSVG')
          .attr('width', this.width)
          .attr('height', this.height);
      } else {
        this.svg = d3
          .select(this.divider.nativeElement)
          .append('svg')
          .attr('id', 'idSVG')
          .attr('width', this.width * 0.8)
          .attr('height', this.height * 0.8);
      }

      this.mapper();
    });
  }

  onResize(event: any) {
    if (+event.target.innerWidth <= 992) {
      this.collapsed = true;
    } else {
      this.collapsed = false;
    }
    if (this.statistiqueState === true) {
      this.xLegend = (+this.elt.nativeElement.offsetWidth * 0.8) / 10.5;
    }
    this.widthObservable.next({
      width: +event.target.innerWidth,
      height: +event.target.innerHeight,
    });
    this.statisticI = -1;
  }

  mapper() {
    this.svg
      .append('rect')
      .attr('class', 'background')
      .attr('width', this.width)
      .attr('height', this.height)
      .on('click', (pointer: any, d: any) => {
        // this.initMap();
      });
    this.district = this.svg.append('g');
    this.commune = this.svg.append('g');

    this.names = d3
      .select(this.divider.nativeElement)
      .append('div')
      .attr('class', 'tooltip hidden');

    d3.json('http://localhost/requestJson.php?f=region').then((json: any) => {
      this.there = json.features[0];
    });

    d3.json('http://localhost/requestJson.php?f=district2').then(
      (json: any) => {
        this.district
          .attr('id', 'district')
          .selectAll('path')
          .data(json.features)
          .enter()
          .append('path')
          .attr('d', this.path)
          .attr('id', (d: any) => d.properties.Lib_dist.replace(' ', '_'))

          .on('click', (pointer: any, d: any) => {
            this.clickDistrict(pointer, d);
          })
          .on('mousemove', (pointer: any, d: any) => {
            this.showTooltip(pointer, d);
          })
          // When the mouse moves out of a feature, hide the tooltip.
          .on('mouseout', () => {
            this.hideTooltip();
          });
      }
    );

    d3.json('http://localhost/requestJson.php?f=commune2')
      .then((json: any) => {
        this.commune
          .attr('id', 'commune')
          .selectAll('path')
          .data(json.features)
          .enter()

          .append('path')
          .attr('d', this.path)
          .attr('class', (d: any) => d.properties.Lib_dist.replace(' ', '_'))
          .attr('id', (d: any) => 'id' + d.properties.Lib_com.replace(' ', '_'))
          .attr('style', 'display: none')
          .on('click', (pointer: any, d: any) => {
            this.clickCommune(pointer, d);
          })
          .on('mousemove', (pointer: any, d: any) => {
            this.showTooltip(pointer, d);
          })
          // When the mouse moves out of a feature, hide the tooltip.
          .on('mouseout', () => {
            this.hideTooltip();
          });
      })
      .then(() => {
        this.initMap();
      });
  }
  showTooltip(pointer: any, d: any) {
    const clientX: number = pointer.clientX + 10;
    const clientY: number = pointer.clientY + 10;
    this.names
      .classed('hidden', false)
      .attr('style', 'left:' + clientX + 'px; top: ' + clientY + 'px')
      .html(d.properties.Nom);
  }

  hideTooltip() {
    this.names.classed('hidden', true);
  }

  prevElement() {
    if (this.level == 2) {
      this.commune
        .selectAll('.' + this.focusElement.properties.Lib_dist)
        .attr('style', 'display: block');
      this.commune
        .selectAll('.' + this.focusElement.properties.Lib_dist)
        .classed('emptyOpacity', false);
      this.setScale(
        this.width,
        this.height,
        this.middleDistrictK,
        this.middleDistrictX,
        this.middleDistrictY
      );
      this.commune.selectAll('path').classed('active', false);
      this.level = 1;
      this.changeMessage(new Echelon(this.focusElement.properties.Lib_dist));
    } else {
      this.district.selectAll('path').classed('emptyOpacity', false);
      // this.commune.selectAll('path').classed('emptyOpacity', false);
      this.level -= 1;
      this.changeMessage(new Echelon());

      this.initMap();
    }
  }

  protected changeMessage(echelon: Echelon) {
    this.stateService.changeMessage(echelon);
  }

  ngOnDestroy(): void {
    this.observer1.unsubscribe();
    this.observer2.unsubscribe();
    this.observer3.unsubscribe();
    this.observer4.unsubscribe();
    this.observer5.unsubscribe();
    this.observer6.unsubscribe();
    this.observer7.unsubscribe();
    this.observer8.unsubscribe();
  }

  statistiqueMode() {
    this.widthObservable.next({
      width: +this.elt.nativeElement.offsetWidth * 0.8,
      height: +this.elt.nativeElement.offsetHeight * 0.8,
    });
    this.xLegend = (+this.elt.nativeElement.offsetWidth * 0.8) / 10.5;
    this.statistiqueState = true;
    this.stateService.changeCollapsed(true);
    const zoom = d3
      .zoom()
      .scaleExtent([1, 10])
      .on('zoom', (eve) => {
        this.zoomed(eve);
      }) as any;
    this.svg.call(zoom);
    this.stateService.changeCurrentIsStatistique(true);
  }

  normalModel() {
    window.location.reload();
    this.ngOnDestroy();
  }

  changeRubrique() {
    let data: any = [];
    this.observer2 = this.statistiqueCommune
      .getByRubrique(+this.statisticI, +this.statistiqueDistrict)
      .subscribe((res: any) => {
        this.intervalData = 1;
        if (this.statistiqueDistrict === true) {
          this.district.selectAll('path').classed('q29', true);
          if (res[0]) {
            const max = res[0].max;
            data = res;
            if (max != 0) {
              this.intervalData = max / 10;
              const interval = max / 10;
              for (let index = 0; index < data.length; index++) {
                this.district
                  .select('#' + data[index].nomDistrict)
                  .classed('q29', false)
                  .classed(
                    'q' + Math.floor(data[index].valeur / interval - 1),
                    true
                  );
              }
            }
          }
        } else {
          this.commune.selectAll('path').classed('q29', true);
          if (res[0]) {
            const max = res[0].max;
            data = res;

            if (max != 0) {
              this.intervalData = max / 10;
              const interval = max / 10;
              for (let index = 0; index < data.length; index++) {
                this.commune
                  .select('#id' + data[index].nomCommune)
                  .classed('q29', false)
                  .classed(
                    'q' + Math.floor(data[index].valeur / interval - 1),
                    true
                  );
              }
            }
          }
        }
      });
  }

  showDistrictStatistique() {
    this.statistiqueDistrict = true;
    this.district.selectAll('path').attr('style', 'display: block');
    this.commune.selectAll('path').attr('style', 'display: none');
    if (this.statisticI !== -1) this.changeRubrique();
  }
  showCommuneStatistique() {
    this.statistiqueDistrict = false;
    this.district.selectAll('path').attr('style', 'display: none');
    this.commune.selectAll('path').attr('style', 'display: block');
    if (this.statisticI !== -1) this.changeRubrique();
  }
  zoomed(e: any) {
    d3.selectAll('#idSVG g').attr('transform', e.transform);
  }
}
