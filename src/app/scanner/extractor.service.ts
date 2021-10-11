import { Inject, Injectable } from '@angular/core';
import { defer, from, Observable, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { Either, left, right } from '@app/core/utils/either.util';
import { DOCUMENT } from '@angular/common';
import { FileEntry } from '@app/database/entries/entry.model';
import { ICommonTagsResult, IFormat } from 'music-metadata/lib/type';

@Injectable()
export class ExtractorService {
  constructor(@Inject(DOCUMENT) private document: Document) {
    const win = document.defaultView;
    if (!win) {
      return;
    }
    import('process')
      .then((process) => {
        (win as any).process = process;
        (win as any).global = window;
        return import('buffer');
      })
      .then((buffer) => {
        (win as any).Buffer = buffer.Buffer;
      });
  }

  extract(entry: FileEntry): Observable<
    Either<{
      common: ICommonTagsResult;
      format: IFormat;
      lastModified: number;
    }>
  > {
    return defer(() => from(entry.handle.getFile())).pipe(
      // filter(file => this.supportedTypes.includes(file.type)),
      concatMap((file) =>
        from(
          import('music-metadata-browser').then((musicMetadata) =>
            musicMetadata.parseBlob(file /*{duration: true}*/)
          )
        ).pipe(
          map(({ common, format }) =>
            right({ common, format, lastModified: file.lastModified })
          )
        )
      ),
      catchError((error) => of(left(error)))
    );
  }
}
