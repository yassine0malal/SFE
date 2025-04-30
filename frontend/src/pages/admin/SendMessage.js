import React from 'react';
import { Html, Head, Body, Container, Section, Text, Img, Hr, Button } from '@react-email/components';

export const EmailTemplate = ({
  logoUrl,
  mainImage,
  title,
  subtitle,
  sectionTitle,
  body,
  ctaTitle,
  ctaText,
  ctaUrl
}) => (
  <Html>
    <Head />
    <Body style={{ backgroundColor: '#f3f3f5', fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif' }}>
      <Container style={{ width: '680px', maxWidth: '100%', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: 8, overflow: 'hidden' }}>
        {/* Logo */}
        <Section style={{ padding: '3px 0 0 0', textAlign: 'start', background: '#D9D9D9' }}>
          <Img src={logoUrl} alt="Logo" width={140} style={{ margin: '0 auto', display: 'block' }} />
        </Section>
        {/* Main Image */}
        {mainImage && (
          <Section style={{ textAlign: 'center', background: '#fff', padding: '24px 0 0 0' }}>
            <Img src={mainImage} alt="Main" style={{ maxWidth: '90%', borderRadius: 8, margin: '0 auto' }} />
          </Section>
        )}
        {/* Title & Subtitle */}
        <Section style={{ padding: '32px 32px 0 32px', background: '#fff' }}>
          <Text style={{ fontSize: 28, fontWeight: 700, color: '#222', marginBottom: 8 }}>{title}</Text>
          <Text style={{ fontSize: 16, color: '#444', marginBottom: 0 }}>{subtitle}</Text>
        </Section>
        {/* Divider */}
        <Section style={{ padding: '24px 32px 0 32px', background: '#fff' }}>
          <Hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '24px 0' }} />
        </Section>
        {/* Section Title & Body */}
        <Section style={{ padding: '0 32px 0 32px', background: '#fff' }}>
          <Text style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 12 }}>{sectionTitle}</Text>
          <Text style={{ fontSize: 15, lineHeight: '21px', color: '#3c3f44' }}>
            <span dangerouslySetInnerHTML={{ __html: body }} />
          </Text>
        </Section>
        {/* CTA */}
        <Section style={{ padding: '32px 32px 40px 32px', background: '#fff', textAlign: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 600, color: '#222', marginBottom: 16 }}>{ctaTitle}</Text>
          <Button
            href={ctaUrl}
            style={{
              backgroundColor: '#0072c6',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              border: 'none',
              borderRadius: 8,
              padding: '1rem 2rem',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            {ctaText}
          </Button>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default EmailTemplate;