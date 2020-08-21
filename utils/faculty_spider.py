from datetime import datetime

import scrapy


def parse_time(time):
    time = time.split('to')
    end_time = None

    try:
        start_time = datetime.strptime(time[0].strip(), '%b %Y')
    except ValueError:
        try:
            start_time = datetime.strptime(time[0].strip(), '%Y')
        except ValueError:
            start_time = None

    if len(time) == 2:
        try:
            end_time = datetime.strptime(time[1].strip(), '%b %Y')
        except ValueError:
            try:
                end_time = datetime.strptime(time[1].strip(), '%Y')
            except ValueError:
                pass

    return start_time, end_time


class FacultySpider(scrapy.Spider):
    name = 'FacultySpider'
    start_urls = [
        'https://lahore.comsats.edu.pk/physics/Faculty.aspx',
        'https://lahore.comsats.edu.pk/Statistics/Faculty.aspx',
        'https://lahore.comsats.edu.pk/math/Faculty.aspx',
        'https://lahore.comsats.edu.pk/humanities/Faculty.aspx',
        'https://lahore.comsats.edu.pk/cs/faculty.aspx',
        'https://lahore.comsats.edu.pk/arch/Faculty.aspx',
        'https://lahore.comsats.edu.pk/doad/faculty.aspx',
        'https://lahore.comsats.edu.pk/chemical/faculty.aspx',
        'https://lahore.comsats.edu.pk/Chemistry/faculty.aspx',
        'https://lahore.comsats.edu.pk/ee/faculty.aspx',
        'https://lahore.comsats.edu.pk/ms/faculty.aspx',
        'https://lahore.comsats.edu.pk/Economics/faculty.aspx',
        'https://lahore.comsats.edu.pk/Pharmacy/faculty.aspx'
    ]

    def parse(self, response, **kwargs):
        for link in response.css('#ctl00_ContentPlaceHolder2_dlFaculty tr'):
            yield response.follow(link.css('a::attr(href)').get(), self.parse_faculty)

        for link in response.css('#ctl00_ContentPlaceHolder2_dlFaculty_onLeave tr'):
            yield response.follow(link.css('a::attr(href)').get(), self.parse_faculty)

    def parse_faculty(self, response):
        qualification = []
        experience = []
        publications = []

        for publication in response.css('[id$=pnlPublications] [id^=ctl00_ContentPlaceHolder1_pnlPub_]'):
            pubs = []

            for row in publication.css('[id^=ctl00_ContentPlaceHolder1_gvPub_] tr'):
                pubs.append({
                    'title': row.css('[id$=lblpublication]::text').get(),
                    'abstract': row.css('[id$=hlAbstractPath]::attr(src)').get(),
                    'detail': row.css('[id$=hlPublicationDetail]::attr(src)').get(),
                })

            publications.append({
                'title': publication.css('div>span.h4 *::text').get().rstrip(':'),
                'publications': pubs
            })

        for row in response.css('#ctl00_ContentPlaceHolder1_dlExperience tr'):
            start_time, end_time = parse_time(row.css('[id$=_timeSpanLabel]::text').get())
            experience.append({
                'position': row.css('[id$=experienceTitleLabel]::text').get(),
                'company': row.css('[id$=instituteLabel]::text').get(),
                'start_time': start_time,
                'end_time': end_time
            })

        for row in response.css('#ctl00_ContentPlaceHolder1_dlQualification tr'):
            start_time, end_time = parse_time(row.css('[id$=_timeSpanLabel]::text').get())

            qualification.append({
                'degree': row.css('[id$=_qualificationTitleLabel]::text').get(),
                'university': row.css('[id$=_DAILabel]::text').get(),
                'country': row.css('[id$=_Label1]::text').get(),
                'start_time': start_time,
                'end_time': end_time
            })

        image = response.css('img.pImage::attr(src)').get()
        image = None if 'cph.jpg' in image else response.urljoin(image)

        hec_approved = response.css('[id$=frmPersonalData_Label1] *::text').get() is not None
        is_on_leave = response.css('[id$=lblEmploymentStatus] *::text').get() is not None

        yield {
            'url': response.request.url,
            'image': image,
            'title': response.css('#ctl00_ContentPlaceHolder1_frmPersonalData_TitleLabel *::text').get(),
            'name': response.css('#ctl00_ContentPlaceHolder1_frmPersonalData_NameLabel *::text').get(),
            'designation': response.css('#ctl00_ContentPlaceHolder1_frmPersonalData_designationTitleLabel::text').get(),
            'department': response.css('#ctl00_ContentPlaceHolder1_frmPersonalData_deptTitleLabel::text').get(),
            'interests': response.css('#ctl00_ContentPlaceHolder1_frmPersonalData_Label3::text').get(),
            'description': response.css('#ctl00_ContentPlaceHolder1_txtDescription *::text').get(),
            'qualification': qualification,
            'experience': experience,
            'publications': publications,
            'hec_approved': hec_approved,
            'is_on_leave': is_on_leave,
        }


if __name__ == '__main__':
    from scrapy.cmdline import execute

    open("data/faculty.json", 'w').close()
    execute("scrapy runspider faculty_spider.py -o data/faculty.json".split())
